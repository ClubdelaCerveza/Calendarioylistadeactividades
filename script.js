// ===== LOGIN =====
const loginContainer = document.getElementById('login-container');
const mainContainer = document.getElementById('main-container');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const msg = document.getElementById('login-msg');

loginBtn.addEventListener('click', () => {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();

  if (!user || !pass) {
    msg.textContent = "Por favor, completa ambos campos.";
    return;
  }

  const savedUser = localStorage.getItem('user');
  const savedPass = localStorage.getItem('pass');

  if (savedUser && savedPass) {
    if (user === savedUser && pass === savedPass) entrar();
    else msg.textContent = "Usuario o contraseña incorrectos.";
  } else {
    localStorage.setItem('user', user);
    localStorage.setItem('pass', pass);
    entrar();
  }
});

logoutBtn.addEventListener('click', () => {
  mainContainer.classList.add('hidden');
  loginContainer.classList.remove('hidden');
});

// ===== ENTRAR =====
function entrar() {
  loginContainer.classList.add('hidden');
  mainContainer.classList.remove('hidden');
  cargarCalendario();
  cargarActividades();
  actualizarContadorEventos();
}

// ===== ACTIVIDADES =====
const lista = document.getElementById('lista-actividades');
const agregarBtn = document.getElementById('agregar-actividad');
const nuevaActividad = document.getElementById('nueva-actividad');
const buscarActividad = document.getElementById('buscar-actividad');

function cargarActividades(filtro = "") {
  const actividades = JSON.parse(localStorage.getItem('actividades')) || [];
  lista.innerHTML = '';
  actividades
    .filter(a => a.toLowerCase().includes(filtro.toLowerCase()))
    .forEach((act, index) => {
      const li = document.createElement('li');
      li.textContent = act;
      const btn = document.createElement('button');
      btn.textContent = 'Eliminar';
      btn.classList.add('borrar');
      btn.onclick = () => eliminarActividad(index);
      li.appendChild(btn);
      lista.appendChild(li);
    });
}

buscarActividad.addEventListener('input', (e) => {
  cargarActividades(e.target.value);
});

function eliminarActividad(index) {
  const actividades = JSON.parse(localStorage.getItem('actividades')) || [];
  actividades.splice(index, 1);
  localStorage.setItem('actividades', JSON.stringify(actividades));
  cargarActividades();
}

agregarBtn.addEventListener('click', () => {
  const texto = nuevaActividad.value.trim();
  if (texto) {
    const actividades = JSON.parse(localStorage.getItem('actividades')) || [];
    actividades.push(texto);
    localStorage.setItem('actividades', JSON.stringify(actividades));
    nuevaActividad.value = '';
    cargarActividades();
  }
});

// ===== CALENDARIO =====
const mesSelect = document.getElementById('mes');
const anioSelect = document.getElementById('anio');
const diasDiv = document.getElementById('dias');
const totalEventos = document.getElementById('total-eventos');

const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function cargarCalendario() {
  mesSelect.innerHTML = '';
  anioSelect.innerHTML = '';

  for (let i = 2025; i <= 2027; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = i;
    anioSelect.appendChild(opt);
  }

  meses.forEach((m, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = m;
    mesSelect.appendChild(opt);
  });

  mesSelect.value = 9; // Octubre
  anioSelect.value = 2025;
  mostrarDias();

  mesSelect.addEventListener('change', mostrarDias);
  anioSelect.addEventListener('change', mostrarDias);
}

function mostrarDias() {
  diasDiv.innerHTML = "";
  const mes = parseInt(mesSelect.value);
  const anio = parseInt(anioSelect.value);
  const dias = new Date(anio, mes + 1, 0).getDate();
  const eventos = JSON.parse(localStorage.getItem('eventos')) || {};

  for (let i = 1; i <= dias; i++) {
    const dia = document.createElement('div');
    dia.classList.add('dia');
    dia.textContent = i;

    const clave = `${anio}-${mes + 1}-${i}`;
    if (eventos[clave]) {
      dia.classList.add('dia-evento');
      dia.title = eventos[clave].join(", ");
    }

    dia.addEventListener('click', () => abrirModal(anio, mes, i));
    diasDiv.appendChild(dia);
  }
}

// ===== MODAL =====
const modal = document.getElementById('modal');
const modalTitulo = document.getElementById('modal-titulo');
const nuevoEvento = document.getElementById('nuevo-evento');
const guardarEvento = document.getElementById('guardar-evento');
const cerrarModal = document.getElementById('cerrar-modal');
const eventosDiaDiv = document.getElementById('eventos-dia');

let diaSeleccionado = null;

function abrirModal(anio, mes, dia) {
  diaSeleccionado = { anio, mes, dia };
  modalTitulo.textContent = `Eventos del ${dia} de ${meses[mes]} de ${anio}`;
  modal.classList.remove('hidden');
  mostrarEventosDia();
}

function mostrarEventosDia() {
  eventosDiaDiv.innerHTML = '';
  const eventos = JSON.parse(localStorage.getItem('eventos')) || {};
  const clave = `${diaSeleccionado.anio}-${diaSeleccionado.mes + 1}-${diaSeleccionado.dia}`;
  const listaEventos = eventos[clave] || [];

  listaEventos.forEach((e, index) => {
    const div = document.createElement('div');
    div.classList.add('evento-item');
    div.textContent = e;
    const btn = document.createElement('button');
    btn.textContent = "❌";
    btn.onclick = () => eliminarEvento(index);
    div.appendChild(btn);
    eventosDiaDiv.appendChild(div);
  });
}

guardarEvento.addEventListener('click', () => {
  const texto = nuevoEvento.value.trim();
  if (!texto) return;

  const eventos = JSON.parse(localStorage.getItem('eventos')) || {};
  const clave = `${diaSeleccionado.anio}-${diaSeleccionado.mes + 1}-${diaSeleccionado.dia}`;
  if (!eventos[clave]) eventos[clave] = [];
  eventos[clave].push(texto);
  localStorage.setItem('eventos', JSON.stringify(eventos));
  nuevoEvento.value = '';
  mostrarEventosDia();
  mostrarDias();
  actualizarContadorEventos();
});

function eliminarEvento(index) {
  const eventos = JSON.parse(localStorage.getItem('eventos')) || {};
  const clave = `${diaSeleccionado.anio}-${diaSeleccionado.mes + 1}-${diaSeleccionado.dia}`;
  eventos[clave].splice(index, 1);
  if (eventos[clave].length === 0) delete eventos[clave];
  localStorage.setItem('eventos', JSON.stringify(eventos));
  mostrarEventosDia();
  mostrarDias();
  actualizarContadorEventos();
}

cerrarModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

function actualizarContadorEventos() {
  const eventos = JSON.parse(localStorage.getItem('eventos')) || {};
  totalEventos.textContent = Object.values(eventos).reduce((acc, arr) => acc + arr.length, 0);
}
