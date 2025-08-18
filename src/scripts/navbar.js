export function initNavbar() {
    function updateNavBarBySection() {
        const headerHeight = 80;
        const planesSection = document.getElementById('planes');
        const footerSection = document.getElementById('footer');
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        // barras
        const barInicio = document.getElementById('bar-inicio');
        const barPlanes = document.getElementById('bar-planes');
        const barContacto = document.getElementById('bar-contacto');

        if (!planesSection || !footerSection || !barInicio || !barPlanes || !barContacto) return;

        barInicio.style.opacity = '0';
        barPlanes.style.opacity = '0';
        barContacto.style.opacity = '0';

        const planesRect = planesSection.getBoundingClientRect();
        const footerRect = footerSection.getBoundingClientRect();

        if (scrollY < headerHeight + 50) {
            barInicio.style.opacity = '1';
        } else if (footerRect.top < windowHeight * 0.6) {
            barContacto.style.opacity = '1';
        } else if (
            planesRect.top < windowHeight * 0.5 &&
            planesRect.bottom > windowHeight * 0.25
        ) {
            barPlanes.style.opacity = '1';
        } else {
            barInicio.style.opacity = '1';
        }
    }

    // eventos de click
    const navInicio = document.getElementById('nav-inicio');
    if (navInicio) {
        navInicio.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(updateNavBarBySection, 700);
        });
    }

    const navPlanes = document.getElementById('nav-planes');
    if (navPlanes) {
        navPlanes.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' });
            setTimeout(updateNavBarBySection, 700);
        });
    }

    const navContacto = document.getElementById('nav-contacto');
    if (navContacto) {
        navContacto.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
            setTimeout(updateNavBarBySection, 700);
        });
    }

    // scroll listener
    window.addEventListener('scroll', updateNavBarBySection);

    // header spacer
    function updateHeaderSpacer() {
        const header = document.querySelector('header');
        const spacer = document.querySelector('.header-spacer');
        if (header && spacer) {
            spacer.style.height = header.offsetHeight + 'px';
        }
    }
    updateHeaderSpacer();
    window.addEventListener('resize', updateHeaderSpacer);

    // llamada inicial
    updateNavBarBySection();
}
