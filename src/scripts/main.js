window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Ajustar velocidad según ancho de pantalla
  let speedFactor;
  if (window.innerWidth >= 1200) {
    speedFactor = 0.1; // velocidad normal
  } else if (window.innerWidth >= 768) {
    speedFactor = 0.07; // más lenta en tablets
  } else {
    speedFactor = 0.045; // aún más lenta en móviles
  }

  const angle = 24 + scrollY * speedFactor;
  document.body.style.background = `linear-gradient(${angle}deg, #d2d6ef, #cab1b7, #0a2036)`;
});

// Datos de planes
const plans = [
  { tipo: "Sesión", nombre: "Individual", precio: 50, sesiones: 1, frecuencia: "Flexible" },
  { tipo: "Plan", nombre: "Base", precio: 170, sesiones: 4, frecuencia: "1 sesión por semana" },
  { tipo: "Plan", nombre: "Básico", precio: 320, sesiones: 8, frecuencia: "2 sesiones por semana" },
  { tipo: "Plan", nombre: "Estándar", precio: 470, sesiones: 12, frecuencia: "3 sesiones por semana" },
  { tipo: "Plan", nombre: "Premium", precio: 600, sesiones: 16, frecuencia: "4 sesiones por semana" },
  { tipo: "Plan", nombre: "Especial", precio: 750, sesiones: 20, frecuencia: "5 sesiones por semana" },
  { tipo: "Extreme", nombre: "Base", precio: 840, sesiones: 24, frecuencia: "6 sesiones por semana" },
  { tipo: "Plan", nombre: "Fullness", precio: 980, sesiones: 28, frecuencia: "7 sesiones por semana" }
];

const container = document.getElementById("plans-container");

// Generar cards dinámicamente
plans.forEach(plan => {
  const card = `
    <div class="bg-[#0d0e0e]/90 text-white rounded-[35px] shadow-lg p-8 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
      <div class="flex flex-col items-center">
        <h3 class="plan-title text-1g font-normal text-[#c4c4c4]">${plan.tipo}</h3>
        <h3 class="plan-title text-xl font-bold -mt-1 mb-4">${plan.nombre}</h3>
        <span class="price text-6xl mb-2"><sup>S/</sup>${plan.precio}</span>
        <p class="text-[#b2b1c4] mb-4">${plan.sesiones} ${plan.sesiones === 1 ? 'sesión' : 'sesiones'}</p>
        <div class="bg-white/5 text-gray-200 text-xs px-3 py-2 rounded-lg flex flex-col items-center sm:flex-row sm:justify-center sm:gap-2 sm:rounded-full">
          <span class="font-bold">Frecuencia:</span>
          <span class="font-normal">${plan.frecuencia}</span>
        </div>
      </div>
      <a href="https://api.whatsapp.com/send?phone=+51967260163&text=Me%20interesa%20el%20plan%20${encodeURIComponent(plan.nombre)}%20de%20${plan.sesiones}%20sesiones%20por%20S/${plan.precio}."
         target="_blank" rel="noopener noreferrer"
         class="mt-6 w-full bg-[#16c784] text-white font-bold py-3 px-4 rounded-full text-center transition-colors duration-300 hover:bg-[#13a86f]">
         Elegir
      </a>
    </div>
  `;
  container.innerHTML += card;
});

function updateNavBarBySection() {
  const headerHeight = 80;
  const planesSection = document.getElementById('planes');
  const footerSection = document.getElementById('footer');
  const windowHeight = window.innerHeight;
  const scrollY = window.scrollY;

  const planesRect = planesSection.getBoundingClientRect();
  const footerRect = footerSection.getBoundingClientRect();

  // Oculta todas las barras
  document.getElementById('bar-inicio').style.opacity = '0';
  document.getElementById('bar-planes').style.opacity = '0';
  document.getElementById('bar-contacto').style.opacity = '0';

  // 1️⃣ Inicio: si el scroll está cerca del tope
  if (scrollY < headerHeight + 50) {
    document.getElementById('bar-inicio').style.opacity = '1';
  }
  // 2️⃣ Footer visible
  else if (footerRect.top < windowHeight * 0.6) {
    document.getElementById('bar-contacto').style.opacity = '1';
  }
  // 3️⃣ Planes visible
  else if (
    planesRect.top < windowHeight * 0.5 &&
    planesRect.bottom > windowHeight * 0.25
  ) {
    document.getElementById('bar-planes').style.opacity = '1';
  }
  // 4️⃣ Por defecto, inicio
  else {
    document.getElementById('bar-inicio').style.opacity = '1';
  }
}

// Scroll suave para los enlaces del menú
document.getElementById('nav-inicio').addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(updateNavBarBySection, 700);
});

document.getElementById('nav-planes').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('planes').scrollIntoView({ behavior: 'smooth' });
  setTimeout(updateNavBarBySection, 700);
});

document.getElementById('nav-contacto').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('footer').scrollIntoView({ behavior: 'smooth' });
  setTimeout(updateNavBarBySection, 700);
});

// Actualiza la barra azul dinámicamente al hacer scroll
window.addEventListener('scroll', updateNavBarBySection);
window.addEventListener('DOMContentLoaded', updateNavBarBySection);