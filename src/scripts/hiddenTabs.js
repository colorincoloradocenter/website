export function initHiddenTabs() {
    const btnJugar = document.getElementById("btn-jugar");
    const juegoSection = document.getElementById("juego");
    const footer = document.getElementById("footer");
    const header = document.querySelector("header");
    const photosWelcome = document.getElementById("photos-welcome");
    const navInicio = document.getElementById("nav-inicio");
    const navPlanes = document.getElementById("nav-planes");
    const navContacto = document.getElementById("nav-contacto");
    const unicornToy = document.getElementById("unicorn-toy");

    if (btnJugar) {
        btnJugar.addEventListener("click", () => {
            document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
            juegoSection.classList.remove("hidden");
            if (photosWelcome) photosWelcome.classList.add("hidden");
            if (navInicio) navInicio.classList.add("hidden");
            if (navPlanes) navPlanes.classList.add("hidden");
            if (navContacto) navContacto.classList.add("hidden");
            if (unicornToy) unicornToy.classList.add("hidden");
            window.dispatchEvent(new Event('resize'));
            juegoSection.scrollIntoView({ behavior: "smooth" });
        });
    }
    const btnVolver = document.getElementById("btn-volver");
    if (btnVolver) {
        btnVolver.addEventListener("click", () => {
            juegoSection.classList.add("hidden");
            document.querySelectorAll("section").forEach(sec => {
                if (sec.id !== "juego") sec.classList.remove("hidden");
            });
            if (photosWelcome) photosWelcome.classList.remove("hidden");
            if (navInicio) navInicio.classList.remove("hidden");
            if (navPlanes) navPlanes.classList.remove("hidden");
            if (navContacto) navContacto.classList.remove("hidden");
            if (unicornToy) unicornToy.classList.remove("hidden");
            window.dispatchEvent(new Event('resize'));
            juegoSection.scrollIntoView({ behavior: "smooth" });
            header.scrollIntoView({ behavior: "smooth" });
        });
    }
}
