// Datos (en memoria)
let users = [];
let currentUser = null;
let activities = [];

// DOM
const loginBtn = document.getElementById("login-btn");
const loginMsg = document.getElementById("login-msg");
const loginContainer = document.getElementById("login-container");
const avatarContainer = document.getElementById("avatar-container");
const mainContainer = document.getElementById("main-container");
const logoutBtn = document.getElementById("logout-btn");
const userListElem = document.getElementById("user-list");
const avatarSaveBtn = document.getElementById("avatar-save");
const activityForm = document.getElementById("activity-form");
const activityList = document.getElementById("activity-list");
const monthSelect = document.getElementById("month-select");
const yearSelect = document.getElementById("year-select");
const calendarGrid = document.getElementById("calendar-grid");

// Inicializar meses y años
const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
months.forEach((m,i)=> { let opt = document.createElement("option"); opt.value=i; opt.textContent=m; monthSelect.appendChild(opt); });
for(let y=2025;y<=2030;y++){ let opt=document.createElement("option"); opt.value=y; opt.textContent=y; yearSelect.appendChild(opt); }

// Login/Registro
loginBtn.addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  if(!username || !password){ loginMsg.textContent="Rellena todos los campos"; return; }
  let user = users.find(u=>u.username===username);
  if(user){ 
    if(user.password===password){ currentUser=user; loginContainer.classList.add("hidden"); avatarContainer.classList.remove("hidden"); }
    else loginMsg.textContent="Contraseña incorrecta";
  } else {
    currentUser={username,password,avatar:null,status:"online"};
    users.push(currentUser);
    loginContainer.classList.add("hidden"); avatarContainer.classList.remove("hidden");
  }
});

// Guardar avatar
avatarSaveBtn.addEventListener("click", () => {
  const gender = document.getElementById("avatar-gender").value;
  const outfit = document.getElementById("avatar-outfit").value;
  currentUser.avatar = {gender,outfit};
  avatarContainer.classList.add("hidden");
  mainContainer.classList.remove("hidden");
  renderUsers();
  renderActivities();
  renderCalendar();
});

// Cerrar sesión
logoutBtn.addEventListener("click", () => {
  currentUser.status="offline";
  currentUser=null;
  mainContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
});

// Render usuarios
function renderUsers(){
  userListElem.innerHTML="";
  users.forEach(u=>{
    let li = document.createElement("li");
    let img = document.createElement("img");
    img.src="https://via.placeholder.com/40";
    let status = document.createElement("span");
    status.className="status "+(u.status==="online"?"online":"offline");
    li.textContent = u.username+" ";
    li.appendChild(status);
    userListElem.appendChild(li);
  });
}

// Actividades
activityForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  let name = document.getElementById("activity-name").value;
  let groups = Array.from(document.getElementById("activity-groups").selectedOptions).map(o=>o.value);
  let date = document.getElementById("activity-date").value;
  activities.push({name,groups,date});
  renderActivities();
  renderCalendar();
  activityForm.reset();
});

function renderActivities(){
  activityList.innerHTML="";
  activities.forEach(a=>{
    let li=document.createElement("li");
    li.textContent=`${a.name} - ${a.date} - ${a.groups.join(", ")}`;
    activityList.appendChild(li);
  });
}

// Calendario
function renderCalendar(){
  let month=parseInt(monthSelect.value);
  let year=parseInt(yearSelect.value);
  calendarGrid.innerHTML="";
  let firstDay=new Date(year,month,1).getDay();
  let daysInMonth=new Date(year,month+1,0).getDate();

  // Ajuste para que lunes sea 0
  let startDay = (firstDay+6)%7;

  for(let i=0;i<startDay;i++){ let d=document.createElement("div"); calendarGrid.appendChild(d); }

  for(let d=1;d<=daysInMonth;d++){
    let dayDiv=document.createElement("div");
    dayDiv.className="day";
    let span=document.createElement("span");
    span.textContent=d;
    dayDiv.appendChild(span);
    let dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    activities.filter(a=>a.date===dateStr).forEach(a=>{
      a.groups.forEach(g=>{
        let ev=document.createElement("span");
        ev.textContent=a.name;
        ev.dataset.group=g;
        ev.className="event";
        dayDiv.appendChild(ev);
      });
    });
    calendarGrid.appendChild(dayDiv);
  }
}

// Cambios calendario
monthSelect.addEventListener("change", renderCalendar);
yearSelect.addEventListener("change", renderCalendar);
