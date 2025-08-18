export function initUniverse() {
    // configuraciones
    let starDensity = 0.15;
    let speedCoeff = 0.03;
    let width, height, starCount;
    let first = true;
    const giantColor = '180,184,240';
    const starColor = '226,225,142';
    const cometColor = '226,225,224';
    const canva = document.getElementById('universe');
    const stars = [];
    let fps = 60;

    if (!canva) return; // seguridad

    // optimización equipos débiles
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        starDensity = 0.1;
        speedCoeff = 0.02;
        fps = 30;
    }

    let universe = canva.getContext('2d');

    // ajustar tamaño inicial
    windowResizeHandler();
    window.addEventListener('resize', windowResizeHandler, false);

    // inicializar estrellas
    for (let i = 0; i < starCount; i++) {
        stars[i] = new Star();
        stars[i].reset();
    }

    draw();

    // ----- funciones -----
    function draw() {
        universe.clearRect(0, 0, width, height);

        for (let star of stars) {
            star.move();
            star.fadeIn();
            star.fadeOut();
            star.draw();
        }

        // lo ideal: solo requestAnimationFrame
        requestAnimationFrame(draw);
    }

    function Star() {
        this.reset = () => {
            this.giant = getProbability(3);
            this.comet = this.giant || first ? false : getProbability(10);
            this.x = getRandInterval(0, width);
            this.y = getRandInterval(0, height);
            this.r = getRandInterval(1.1, 2.6);
            this.dx = getRandInterval(speedCoeff, 6 * speedCoeff)
                + (this.comet ? speedCoeff * getRandInterval(50, 120) : 0)
                + speedCoeff * 2;
            this.dy = -getRandInterval(speedCoeff, 6 * speedCoeff)
                - (this.comet ? speedCoeff * getRandInterval(50, 120) : 0);
            this.fadingOut = null;
            this.fadingIn = true;
            this.opacity = 0;
            this.opacityTresh = getRandInterval(0.2, 1 - (this.comet ? 0.4 : 0));
            this.do = getRandInterval(0.0005, 0.002) + (this.comet ? 0.001 : 0);
        };

        this.fadeIn = () => {
            if (this.fadingIn) {
                this.fadingIn = this.opacity > this.opacityTresh ? false : true;
                this.opacity += this.do;
            }
        };

        this.fadeOut = () => {
            if (this.fadingOut) {
                this.fadingOut = this.opacity < 0 ? false : true;
                this.opacity -= this.do / 2;
                if (this.x > width || this.y < 0) {
                    this.fadingOut = false;
                    this.reset();
                }
            }
        };

        this.draw = () => {
            universe.beginPath();

            if (this.giant) {
                universe.fillStyle = `rgba(${giantColor},${this.opacity})`;
                universe.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
            } else if (this.comet) {
                universe.fillStyle = `rgba(${cometColor},${this.opacity})`;
                universe.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, false);

                for (let i = 0; i < 30; i++) {
                    universe.fillStyle = `rgba(${cometColor},${this.opacity - (this.opacity / 20) * i})`;
                    universe.rect(this.x - this.dx / 4 * i, this.y - this.dy / 4 * i - 2, 2, 2);
                    universe.fill();
                }
            } else {
                universe.fillStyle = `rgba(${starColor},${this.opacity})`;
                universe.rect(this.x, this.y, this.r, this.r);
            }

            universe.closePath();
            universe.fill();
        };

        this.move = () => {
            this.x += this.dx;
            this.y += this.dy;
            if (this.fadingOut === false) {
                this.reset();
            }
            if (this.x > width || this.y < 0) {
                this.fadingOut = true;
            }
        };

        setTimeout(() => { first = false; }, 50);
    }

    function getProbability(percents) {
        return ((Math.floor(Math.random() * 1000) + 1) < percents * 10);
    }

    function getRandInterval(min, max) {
        return (Math.random() * (max - min) + min);
    }

    function windowResizeHandler() {
        width = window.innerWidth;
        const footer = document.getElementById('footer');
        const footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : window.innerHeight;
        height = Math.max(window.innerHeight, footerTop);
        starCount = width * starDensity;
        canva.width = width;
        canva.height = height;
    }

    window.addEventListener('scroll', () => {
        const footer = document.getElementById('footer');
        const footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : height;
        const newHeight = Math.max(window.innerHeight, window.scrollY + window.innerHeight, footerTop);

        if (newHeight > height) {
            canva.height = newHeight;
            const extraStars = Math.floor((newHeight - height) * starDensity);
            for (let i = 0; i < extraStars; i++) {
                const s = new Star();
                s.reset();
                s.x = getRandInterval(0, width);
                s.y = getRandInterval(height, newHeight);
                stars.push(s);
            }
            height = newHeight;
            starCount = width * starDensity;
        }
    });
}
