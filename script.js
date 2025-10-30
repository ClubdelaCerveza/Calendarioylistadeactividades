// --------------------
// Registro y Login
// --------------------
function register() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const message = document.getElementById('login-message');

    if(!username || !password) {
        message.innerText = "Ingrese usuario y contraseña";
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};
    if(users[username]) {
        message.innerText = "Usuario ya existe";
        return;
    }

    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    message.style.color = "green";
    message.innerText = "Usuario creado correctamente. Ahora inicia sesión.";
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const message = document.getElementById('login-message');

    let users = JSON.parse(localStorage.getItem('users')) || {};
    if(users[username] && users[username] === password) {
        localStorage.setItem('currentUser', username);
        showMain();
    } else {
        message.style.color = "red";
        message.innerText = "Usuario o contraseña incorrectos";
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('main-container').style.display = "none";
    document.getElementById('login-container').style.display = "block";
}

// --------------------
// Interfaz principal
// --------------------
function showMain() {
    const user = localStorage.getItem('currentUser');
    if(!user) return;

    document.getElementById('login-container').style.display = "none";
    document.getElementById('main-container').style.display = "block";
    document.getElementById('user-display').innerText = user;

    loadActivities();
    setCurrentMonthYear();
    drawCalendar();
}

window.onload = function() {
    if(localStorage.getItem('currentUser')) {
        showMain();
    }
}

// --------------------
// Actividades con fecha
// --------------------
function addActivity() {
    const activityInput = document.getElementById('new-activity');
    const activityName = activityInput.value.trim();
    if(!activityName) return;

    // Pedir fecha
    const dateStr = prompt("Ingrese fecha de la actividad (YYYY-MM-DD):");
    if(!dateStr) return;
    const date = new Date(dateStr);
    if(isNaN(date)) {
        alert("Fecha inválida");
        return;
    }

    let activities = JSON.parse(localStorage.getItem('activities_' + localStorage.getItem('currentUser'))) || [];
    activities.push({
        activity: activityName,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
    });
    localStorage.setItem('activities_' + localStorage.getItem('currentUser'), JSON.stringify(activities));

    activityInput.value = "";
    loadActivities();
    drawCalendar();
}

function loadActivities() {
    const list = document.getElementById('activity-list');
    list.innerHTML = "";
    let activities = JSON.parse(localStorage.getItem('activities_' + localStorage.getItem('currentUser'))) || [];
    activities.forEach((a, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${a.activity} (${a.year}-${a.month+1}-${a.day}) 
                        <button onclick="editActivityDate(${index})">Editar Fecha</button>
                        <button onclick="deleteActivity(${index})">Borrar</button>`;
        list.appendChild(li);
    });
}

function deleteActivity(index) {
    let activities = JSON.parse(localStorage.getItem('activities_' + localStorage.getItem('currentUser'))) || [];
    activities.splice(index, 1);
    localStorage.setItem('activities_' + localStorage.getItem('currentUser'), JSON.stringify(activities));
    loadActivities();
    drawCalendar();
}

function editActivityDate(index) {
    let activities = JSON.parse(localStorage.getItem('activities_' + localStorage.getItem('currentUser'))) || [];
    const a = activities[index];
    const dateStr = prompt("Editar fecha de la actividad (YYYY-MM-DD):", `${a.year}-${a.month+1}-${a.day}`);
    if(!dateStr) return;
    const date = new Date(dateStr);
    if(isNaN(date)) {
        alert("Fecha inválida");
        return;
    }
    a.day = date.getDate();
    a.month = date.getMonth();
    a.year = date.getFullYear();
    localStorage.setItem('activities_' + localStorage.getItem('currentUser'), JSON.stringify(activities));
    loadActivities();
    drawCalendar();
}

// --------------------
// Calendario
// --------------------
function setCurrentMonthYear() {
    const now = new Date();
    document.getElementById('month-select').value = now.getMonth();
    document.getElementById('year-select').value = now.getFullYear();
}

function drawCalendar() {
    const month = parseInt(document.getElementById('month-select').value);
    const year = parseInt(document.getElementById('year-select').value);
    const table = document.getElementById('calendar-table');
    table.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Encabezado
    let header = table.insertRow();
    ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].forEach(d => {
        let cell = header.insertCell();
        cell.innerText = d;
        cell.style.fontWeight = "bold";
        cell.style.backgroundColor = "#f0f0f0";
    });

    let row = table.insertRow();
    for(let i=0; i<firstDay; i++) row.insertCell();

    let activities = JSON.parse(localStorage.getItem('activities_' + localStorage.getItem('currentUser'))) || [];

    for(let day=1; day<=daysInMonth; day++) {
        if(row.cells.length === 7) row = table.insertRow();
        let cell = row.insertCell();
        cell.style.verticalAlign = "top";
        cell.style.height = "80px";

        const dayDiv = document.createElement('div');
        dayDiv.innerHTML = `<strong>${day}</strong>`;
        cell.appendChild(dayDiv);

        // Mostrar actividades del día
        activities.forEach((a) => {
            if(a.day === day && a.month === month && a.year === year) {
                const actDiv = document.createElement('div');
                actDiv.className = "activity-day";
                actDiv.innerText = a.activity;
                cell.appendChild(actDiv);
            }
        });
    }
}
