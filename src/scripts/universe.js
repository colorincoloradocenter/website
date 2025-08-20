export function initUniverse() {
    window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
const maxScroll = 2000;
const t = Math.min(scrollY / maxScroll, 1);

    let speedFactor;
    if (window.innerWidth >= 1200) {
        speedFactor = 0.1;
    } else if (window.innerWidth >= 768) {
        speedFactor = 0.07;
    } else {
        speedFactor = 0.045;
    }

    const angle = 24 + scrollY * speedFactor;
    const color1 = `rgba(${5 + 20 * t},${8 + 30 * t},${15 + 60 * t},1)`;
    const color2 = `rgba(${18 + 80 * t},${16 + 60 * t},${25 + 80 * t},1)`;
    const color3 = `rgba(${30 + 40 * t},${22 + 40 * t},${35 + 80 * t},1)`;
    document.body.style.background = `linear-gradient(24deg, ${color1}, ${color2}, ${color3})`;
    });

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

    if (!canva) return;

    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        starDensity = 0.1;
        speedCoeff = 0.02;
        fps = 30;
    }

    let universe = canva.getContext('2d');

    windowResizeHandler();
    window.addEventListener('resize', windowResizeHandler, false);

    for (let i = 0; i < starCount; i++) {
        stars[i] = new Star();
        stars[i].reset();
    }

    draw();

    function draw() {
        universe.clearRect(0, 0, width, height);

        const shake = window.isUnicornShaking ? 2 : 0;
        window.unicornDragDX = window.unicornDragDX || 0;
        window.unicornDragDY = window.unicornDragDY || 0;
        window.unicornOffsetX = window.unicornOffsetX || 0;
        window.unicornOffsetY = window.unicornOffsetY || 0;
        window.isUniverseReturning = window.isUniverseReturning || false;

        if (window.unicornDragDX || window.unicornDragDY) {
            window.unicornOffsetX -= window.unicornDragDX * 0.95;
            window.unicornOffsetY -= window.unicornDragDY * 0.95;

            window.unicornDragDX *= 0.92;
            window.unicornDragDY *= 0.92;
            if (Math.abs(window.unicornDragDX) < 0.01) window.unicornDragDX = 0;
            if (Math.abs(window.unicornDragDY) < 0.01) window.unicornDragDY = 0;

            if (window.unicornDragDX === 0 && window.unicornDragDY === 0 &&
                (Math.abs(window.unicornOffsetX) > 0.5 || Math.abs(window.unicornOffsetY) > 0.5)) {
                window.isUniverseReturning = true;
            }
        }

        if (window.isUniverseReturning) {
            const returnSpeed = 0.01;
            const dx = window.unicornOffsetX * returnSpeed;
            const dy = window.unicornOffsetY * returnSpeed;
            window.unicornOffsetX -= dx;
            window.unicornOffsetY -= dy;

            if (Math.abs(window.unicornOffsetX) < 1 && Math.abs(window.unicornOffsetY) < 1) {
                window.unicornOffsetX = 0;
                window.unicornOffsetY = 0;
                window.isUniverseReturning = false;
            }
        }

        for (let star of stars) {
            let drawX = star.x - window.unicornOffsetX + (shake ? (Math.random() - 0.5) * shake : 0);
            let drawY = star.y - window.unicornOffsetY + (shake ? (Math.random() - 0.5) * shake : 0);

            star.move();
            star.fadeIn();
            star.fadeOut();

            universe.beginPath();
            if (star.giant) {
                universe.fillStyle = `rgba(180,184,240,${star.opacity})`;
                universe.arc(drawX, drawY, 2, 0, 2 * Math.PI);
            } else if (star.comet) {
                universe.fillStyle = `rgba(226,225,224,${star.opacity})`;
                universe.arc(drawX, drawY, 1.5, 0, 2 * Math.PI);
                for (let i = 0; i < 30; i++) {
                    universe.fillStyle = `rgba(226,225,224,${star.opacity - (star.opacity / 20) * i})`;
                    universe.rect(drawX - star.dx / 4 * i, drawY - star.dy / 4 * i - 2, 2, 2);
                    universe.fill();
                }
            } else {
                universe.fillStyle = `rgba(226,225,142,${star.opacity})`;
                universe.rect(drawX, drawY, star.r, star.r);
            }
            universe.closePath();
            universe.fill();
        }

        requestAnimationFrame(draw);
    }

    function Star() {
        this.reset = () => {
            this.giant = getProbability(3);
            this.comet = this.giant || first ? false : getProbability(10);
            this.x = getRandInterval(0, width);
            this.y = getRandInterval(0, height);
            this.r = getRandInterval(1, 2.6);
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
