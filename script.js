const form = document.getElementById("formComentario");
const lista = document.getElementById("listaComentarios");
// Cargar comentarios almacenados localmente
document.addEventListener("DOMContentLoaded", () => {
    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    comentarios.forEach(c => mostrarComentario(c.nombre, c.mensaje));
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const mensaje = document.getElementById("mensaje").value;

    mostrarComentario(nombre, mensaje);
    guardarComentario(nombre, mensaje);

    form.reset();
});

function mostrarComentario(nombre, mensaje) {
    const div = document.createElement("div");
    div.classList.add("comentario");
    div.innerHTML = `<strong>${nombre}:</strong> <p>${mensaje}</p>`;
    lista.appendChild(div);
}

function guardarComentario(nombre, mensaje) {
    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    comentarios.push({ nombre, mensaje });
    localStorage.setItem("comentarios", JSON.stringify(comentarios));
}

// Manejo de audio
document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById('bgm');
    const btn = document.getElementById('btnAudio');
    const storageKey = 'ubk_audio_playing';

    function updateButton(playing){
        btn.textContent = playing ? '🔊' : '🔈';
        btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    }

    let preferPlay = localStorage.getItem(storageKey);
    preferPlay = (preferPlay === null || preferPlay === '1');

    function tryPlay(){
        if (preferPlay) {
            audio.play().then(() => {
                updateButton(true);
                localStorage.setItem(storageKey, '1');
            }).catch(() => {
                updateButton(false);
            });
        } else {
            audio.pause();
            updateButton(false);
        }
    }

    tryPlay();

    btn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                updateButton(true);
                localStorage.setItem(storageKey, '1');
            }).catch(() => { updateButton(false); });
        } else {
            audio.pause();
            updateButton(false);
            localStorage.setItem(storageKey, '0');
        }
    });
});

// Manejo de pestañas / marcos
document.addEventListener("DOMContentLoaded", () => {
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const marcos = Array.from(document.querySelectorAll('.marco'));

    function showMarco(id, pushState = true){
        marcos.forEach(m => {
            const isActive = m.id === id;
            m.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });
        tabs.forEach(t => {
            const pressed = t.dataset.target === id;
            t.setAttribute('aria-pressed', pressed ? 'true' : 'false');
        });
        if (pushState) {
            history.replaceState(null, '', '#' + id);
        }
        const panel = document.getElementById(id);
        if (panel) panel.focus();
    }

    tabs.forEach(t => {
        t.addEventListener('click', () => showMarco(t.dataset.target));
    });

    const hash = (location.hash || '').replace('#','');
    const startId = hash && document.getElementById(hash) ? hash : (tabs[0] && tabs[0].dataset.target);
    showMarco(startId, false);

    document.querySelector('.tabs').addEventListener('keydown', (e) => {
        const currentIndex = tabs.findIndex(t => t.getAttribute('aria-pressed') === 'true');
        if (e.key === 'ArrowRight') {
            const next = tabs[(currentIndex + 1) % tabs.length];
            next.focus();
            showMarco(next.dataset.target);
        } else if (e.key === 'ArrowLeft') {
            const prev = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
            prev.focus();
            showMarco(prev.dataset.target);
        }
    });

    window.addEventListener('hashchange', () => {
        const id = location.hash.replace('#','');
        if (document.getElementById(id)) showMarco(id, false);
    });
});

// --- GALERÍA EXPANDIBLE ---
const imagenes = document.querySelectorAll(".galeria img");
const visor = document.getElementById("visor");
const imagenAmpliada = document.getElementById("imagenAmpliada");
const btnCerrar = document.getElementById("cerrarVisor");
const btnAnterior = document.getElementById("anterior");
const btnSiguiente = document.getElementById("siguiente");

let indiceActual = 0;

// Abrir visor al hacer clic en una imagen
imagenes.forEach((img, index) => {
    img.addEventListener("click", () => {
        indiceActual = index;
        mostrarImagen();
    });
});

function mostrarImagen() {
    const imagen = imagenes[indiceActual];
    imagenAmpliada.src = imagen.src;
    visor.classList.remove("oculto");
}

// Cerrar visor
btnCerrar.addEventListener("click", () => visor.classList.add("oculto"));
visor.addEventListener("click", (e) => {
    if (e.target === visor) visor.classList.add("oculto");
});

// Navegación con botones
btnAnterior.addEventListener("click", () => cambiarImagen(-1));
btnSiguiente.addEventListener("click", () => cambiarImagen(1));

function cambiarImagen(direccion) {
    indiceActual += direccion;
    if (indiceActual < 0) indiceActual = imagenes.length - 1;
    if (indiceActual >= imagenes.length) indiceActual = 0;
    mostrarImagen();
}

// --- Navegación con teclado ---
document.addEventListener("keydown", (e) => {
    if (visor.classList.contains("oculto")) return; // solo si está abierto
    if (e.key === "ArrowLeft") cambiarImagen(-1);
    if (e.key === "ArrowRight") cambiarImagen(1);
    if (e.key === "Escape") visor.classList.add("oculto");
});


document.getElementById("winBtn").addEventListener("click", function() {
  mostrarMensaje("Descargando versión de Windows...");
  // Simula una descarga real:
  setTimeout(() => {
    mostrarMensaje("✅ ¡Descarga completada!");
  }, 2000);
});

document.getElementById("linuxBtn").addEventListener("click", function() {
  mostrarMensaje("Descargando versión de Linux...");
  setTimeout(() => {
    mostrarMensaje("✅ ¡Descarga completada!");
  }, 2000);
});

function mostrarMensaje(texto) {
  const msg = document.getElementById("mensajeDescarga");
  msg.textContent = texto;
}
