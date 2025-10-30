// Gestión de usuarios
function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(!username || !password) {
        document.getElementById('login-message').innerText = "Ingrese usuario y contraseña";
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};
    if(users[username]) {
        document.getElementById('login-message').innerText = "Usuario ya existe";
        return;
    }

    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('login-message').innerText = "Usuario creado. Inicie sesión.";
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || {};
    if(users[username] === password) {
        localStorage.setItem('currentUser', username);
        showMain();
    } else {
        document.getElementById('login-message').innerText = "Usuario o contraseña incorrectos";
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('main-container').style.display = "none";
    document.getElementById('login-container').style.display = "block";
}

// Mostrar interfaz principal
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

// Establecer mes y año actuales al cargar
function setCurrentMonthYear() {
    const now = new Date();
    document.getElementById('month-select').value = now.getMonth();
    document.getElementById('year-select').value = now.getFullYear();
}

// Gestión de actividades
function addActivity() {
    const activityInput = document.getElementById('new-activity');
    const activity = activityInput.value.trim();
    if(!activity) return;

    let activities = JSON.parse(localStorage.getItem('activities_' + localStorage.getItem('currentUser'))) || [];
    activities.push({activity: activity, day: null, month: null, year: null});
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
        li.innerHTML = `${a.activity} <button onclick="deleteActivity(${index})">Borrar</button>`;
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

// Calendario mejorado
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

        // Mostrar actividades asignadas
        activities.forEach((a) => {
            if(a.day === day && a.month === month && a.year === year) {
                const actDiv = document.createElement('div');
                actDiv.className = "activity-day";
                actDiv.innerText = a.activity;
                cell.appendChild(actDiv);
            }
        });

        // Asignar actividad al día al hacer click
        cell.onclick = function() {
            if(activities.length === 0) {
                alert("No hay actividades para asignar.");
                return;
            }
            const actList = activities.map(a => a.activity);
            const activityName = prompt("Seleccione actividad para este día:\n" + actList.join("\n"));
            let selected = activities.find(a => a.activity === activityName);
            if(selected) {
                selected.day = day;
                selected.month = month;
                selected.year = year;
                localStorage.setItem('activities_' + localStorage.getItem('currentUser'), JSON.stringify(activities));
                drawCalendar();
            }
        }
    }
}

showMain();
