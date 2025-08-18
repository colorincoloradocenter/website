export function initPlancards() {
    const plans = [
        { tipo: "Sesión", nombre: "Individual", precio: 50, sesiones: 1, frecuencia: "Flexible" },
        { tipo: "Plan", nombre: "Base", precio: 170, sesiones: 4, frecuencia: "1 sesión por semana" },
        { tipo: "Plan", nombre: "Básico", precio: 305, sesiones: 8, frecuencia: "2 sesiones por semana" },
        { tipo: "Plan", nombre: "Estándar", precio: 455, sesiones: 12, frecuencia: "3 sesiones por semana" },
        { tipo: "Plan", nombre: "Premium", precio: 600, sesiones: 16, frecuencia: "4 sesiones por semana" },
        { tipo: "Plan", nombre: "Especial", precio: 750, sesiones: 20, frecuencia: "5 sesiones por semana" },
        { tipo: "Plan", nombre: "Extremo", precio: 840, sesiones: 24, frecuencia: "6 sesiones por semana" },
        { tipo: "Plan", nombre: "Full", precio: 980, sesiones: 28, frecuencia: "7 sesiones por semana" }
    ];

    const container = document.getElementById("plans-container");
    if (!container) return;

    plans.forEach(plan => {
        const card = `
            <div class="plan-card bg-[#0d0e0e]/90 text-white rounded-[35px] shadow-lg p-8 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
                <div class="flex flex-col items-center">
                    <h3 class="plan-title text-lg font-normal text-[#c4c4c4]">${plan.tipo}</h3>
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
        container.insertAdjacentHTML("beforeend", card);
    });
    // --- efecto ripple ---
    const cards = document.querySelectorAll(".plan-card");
    cards.forEach(card => {
        card.addEventListener("click", function(e) {
            // Evitar que se active si se hace click en el botón interno
            if (e.target.tagName.toLowerCase() === "a") return;

            const ripple = document.createElement("span");
            ripple.classList.add("ripple");

            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + "px";
            ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
            ripple.style.top = (e.clientY - rect.top - size / 2) + "px";

            card.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}
