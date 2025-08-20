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
            <div class="plan-card bg-[#0d0e0e]/90 text-white rounded-[35px] p-8 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
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
                class="mt-6 w-full bg-[#0142c0] text-white font-regular py-3 px-4 rounded-full text-center transition-colors duration-300 hover:bg-[#062869] flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
                    </svg>
                    <span class="ml-2">Elegir</span>
                </a>

            </div>
        `;
        container.insertAdjacentHTML("beforeend", card);
    });

    const cards = document.querySelectorAll(".plan-card");
    cards.forEach(card => {
        card.addEventListener("click", function(e) {
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
