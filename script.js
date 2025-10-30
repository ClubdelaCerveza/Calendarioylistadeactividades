const activityForm = document.getElementById("activity-form");
const activityList = document.getElementById("activity-list");
const monthSelect = document.getElementById("month-select");
const yearSelect = document.getElementById("year-select");
const calendarGrid = document.getElementById("calendar-grid");

let activities = [];

// Inicializar meses y años
const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
for(let i=0;i<months.length;i++) monthSelect.innerHTML += `<option value="${i}">${months[i]}</option>`;
for(let y=2025; y<=2030; y++) yearSelect.innerHTML += `<option value="${y}">${y}</option>`;

// Función para agregar actividad
activityForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("activity-name").value;
  const date = document.getElementById("activity-date").value;
  const groups = Array.from(document.getElementById("activity-groups").selectedOptions).map(opt => opt.value);

  if(name && date && groups.length){
    const activity = { name, date, groups };
    activities.push(activity);
    renderActivities();
    renderCalendar();
    activityForm.reset();
  }
});

// Renderizado de actividades
function renderActivities(){
  activityList.innerHTML = "";
  activities.sort((a,b)=> new Date(a.date)-new Date(b.date));
  activities.forEach(act => {
    const li = document.createElement("li");
    li.textContent = `${act.date}: ${act.name} (${act.groups.join(", ")})`;
    li.dataset.groups = act.groups.join(",");
    activityList.appendChild(li);
  });
}

// Renderizado calendario
function renderCalendar(){
  const month = parseInt(monthSelect.value);
  const year = parseInt(yearSelect.value);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  calendarGrid.innerHTML = "";
  for(let i=0;i<firstDay;i++) calendarGrid.innerHTML += `<div class="day empty"></div>`;

  for(let d=1; d<=daysInMonth; d++){
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.innerHTML = `<span>${d}</span>`;

    const currentDate = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    activities.filter(a => a.date===currentDate).forEach(act => {
      act.groups.forEach(group => {
        const ev = document.createElement("div");
        ev.className = "event";
        ev.dataset.group = group;
        ev.textContent = act.name;
        dayDiv.appendChild(ev);
      });
    });

    calendarGrid.appendChild(dayDiv);
  }
}

// Actualizar calendario al cambiar mes/año
monthSelect.addEventListener("change", renderCalendar);
yearSelect.addEventListener("change", renderCalendar);

// Inicializar calendario
monthSelect.value = new Date().getMonth();
yearSelect.value = new Date().getFullYear();
renderCalendar();
