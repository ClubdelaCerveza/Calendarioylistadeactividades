// Datos simulados
let users = [];
let activities = [];
let currentUser = null;

// Elementos
const loginContainer = document.getElementById("login-container");
const mainContainer = document.getElementById("main-container");
const loginBtn = document.getElementById("login-btn");
const loginMsg = document.getElementById("login-msg");
const logoutBtn = document.getElementById("logout-btn");
const activityForm = document.getElementById("activity-form");
const activityList = document.getElementById("activity-list");
const monthSelect = document.getElementById("month-select");
const yearSelect = document.getElementById("year-select");
const calendarGrid = document.getElementById("calendar-grid");

// Inicializar meses y años (2025-2030)
for(let m=0; m<12; m++){
  let option = document.createElement("option");
  option.value = m;
  option.textContent = new Date(0,m).toLocaleString('es-ES',{month:'long'});
  monthSelect.appendChild(option);
}
for(let y=2025; y<=2030; y++){
  let option = document.createElement("option");
  option.value = y;
  option.textContent = y;
  yearSelect.appendChild(option);
}

// LOGIN / REGISTRO
loginBtn.addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  if(!username || !password){ 
    loginMsg.textContent="Rellena todos los campos"; 
    return; 
  }

  let user = users.find(u => u.username === username);
  if(user){ 
    if(user.password === password){ 
      currentUser = user;
      loginContainer.classList.add("hidden");
      mainContainer.classList.remove("hidden");
      renderActivities();
      renderCalendar();
    } else {
      loginMsg.textContent = "Contraseña incorrecta";
    }
  } else {
    currentUser = {username,password};
    users.push(currentUser);
    loginContainer.classList.add("hidden");
    mainContainer.classList.remove("hidden");
    renderActivities();
    renderCalendar();
  }
});

// CERRAR SESIÓN
logoutBtn.addEventListener("click", () => {
  currentUser = null;
  mainContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
});

// ACTIVIDADES
activityForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if(!currentUser) return; // Solo usuarios registrados
  let name = document.getElementById("activity-name").value;
  let groups = Array.from(document.getElementById("activity-groups").selectedOptions).map(o => o.value);
  let date = document.getElementById("activity-date").value;
  activities.push({name,groups,date});
  renderActivities();
  renderCalendar();
  activityForm.reset();
});

function renderActivities(){
  activityList.innerHTML="";
  activities.forEach(a => {
    let li = document.createElement("li");
    li.textContent = `${a.name} - ${a.date} - ${a.groups.join(", ")}`;
    activityList.appendChild(li);
  });
}

// CALENDARIO
function renderCalendar(){
  if(!currentUser) return; // Solo usuarios registrados
  let month = parseInt(monthSelect.value);
  let year = parseInt(yearSelect.value);
  calendarGrid.innerHTML="";
  let firstDay = new Date(year, month, 1).getDay();
  let daysInMonth = new Date(year, month+1, 0).getDate();
  let startDay = (firstDay+6)%7;

  for(let i=0; i<startDay; i++){ calendarGrid.appendChild(document.createElement("div")); }

  for(let d=1; d<=daysInMonth; d++){
    let dayDiv = document.createElement("div");
    dayDiv.className = "day";
    let span = document.createElement("span");
    span.textContent = d;
    dayDiv.appendChild(span);
    let dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    activities.filter(a => a.date===dateStr).forEach(a => {
      a.groups.forEach(g => {
        let ev = document.createElement("span");
        ev.textContent = a.name;
        ev.dataset.group = g;
        ev.className = "event";
        dayDiv.appendChild(ev);
      });
    });
    calendarGrid.appendChild(dayDiv);
  }
}

monthSelect.addEventListener("change", renderCalendar);
yearSelect.addEventListener("change", renderCalendar);
