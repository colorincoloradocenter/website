export function initUniverse() {
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const maxScroll = 2000;
        const t = Math.min(scrollY / maxScroll, 1);

        let speedFactor;
        if (window.innerWidth >= 1200) speedFactor = 0.1;
        else if (window.innerWidth >= 768) speedFactor = 0.07;
        else speedFactor = 0.045;

        const color1 = `rgba(${5 + 20 * t},${8 + 30 * t},${15 + 60 * t},1)`;
        const color2 = `rgba(${18 + 80 * t},${16 + 60 * t},${25 + 80 * t},1)`;
        const color3 = `rgba(${30 + 40 * t},${22 + 40 * t},${35 + 80 * t},1)`;
        document.body.style.background = `linear-gradient(24deg, ${color1}, ${color2}, ${color3})`;
    });

    const STAR_DENSITY = 0.0001; 
    let speedCoeff = 0.037;

    let width, height;
    let first = true;
    const giantColor = '180,184,240';
    const starColor = '226,225,142';
    const cometColor = '226,225,224';
    const canva = document.getElementById('universe');
    const stars = [];

    let bufferX = 0, bufferY = 0;
    let world = { left: 0, right: 0, top: 0, bottom: 0 };

    if (!canva) return;

    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        speedCoeff = 0.02;
    }

    const universe = canva.getContext('2d');

    windowResizeHandler(true);
    setTimeout(() => windowResizeHandler(false), 50);
    draw();

    function draw() {
        universe.clearRect(0, 0, width, height);
        const shake = window.isUnicornShaking ? 2 : 0;
        window.unicornDragDX = window.unicornDragDX || 0;
        window.unicornDragDY = window.unicornDragDY || 0;
        window.unicornOffsetX = window.unicornOffsetX || 0;
        window.unicornOffsetY = window.unicornOffsetY || 0;
        window.isUniverseReturning = window.isUniverseReturning || false;
        window.isUnicornHeld = window.isUnicornHeld || false;

        if (!window.isUnicornHeld) {
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

        const parallax = 0.55;

        ensureCoverage(parallax);

        for (let star of stars) {
            const drawX = star.x + window.unicornOffsetX * parallax + (shake ? (Math.random() - 0.5) * shake : 0);
            const drawY = star.y + window.unicornOffsetY * parallax + (shake ? (Math.random() - 0.5) * shake : 0);

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
            this.giant = getProbability(0.9);
            this.comet = this.giant || first ? false : getProbability(3);
            this.x = getRandInterval(world.left, world.right);
            this.y = getRandInterval(world.top, world.bottom);
            this.r = getRandInterval(0.5, 2.3);
            this.dx = getRandInterval(speedCoeff, 6 * speedCoeff)
                + (this.comet ? speedCoeff * getRandInterval(30, 65) : 0)
                + speedCoeff * 2;
            this.dy = -getRandInterval(speedCoeff, 6 * speedCoeff)
                - (this.comet ? speedCoeff * getRandInterval(30, 65) : 0);
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
                if (this.x > world.right || this.y < world.top) {
                    this.fadingOut = false;
                    this.reset();
                }
            }
        };

        this.move = () => {
            this.x += this.dx;
            this.y += this.dy;
            if (this.fadingOut === false) this.reset();
            if (this.x > world.right || this.y < world.top) this.fadingOut = true;
        };

        setTimeout(() => { first = false; }, 50);
    }

    function desiredCount() {
        const w = world.right - world.left;
        const h = world.bottom - world.top;
        return Math.floor(w * h * STAR_DENSITY);
    }

    function setWorldBounds() {
        bufferX = Math.ceil(window.innerWidth);
        bufferY = Math.ceil(window.innerHeight);
        world.left = -bufferX;
        world.right = width + bufferX;
        world.top = -bufferY;
        world.bottom = height + bufferY;
    }

    function fillStarsArea(x0, y0, x1, y1) {
        const area = Math.max(0, x1 - x0) * Math.max(0, y1 - y0);
        if (area <= 0) return;
        const need = Math.floor(area * STAR_DENSITY);
        for (let i = 0; i < need; i++) {
            const s = new Star();
            s.reset();
            s.x = getRandInterval(x0, x1);
            s.y = getRandInterval(y0, y1);
            stars.push(s);
        }
    }

    function windowResizeHandler(firstTime = false) {
        width = window.innerWidth;

        const footer = document.getElementById('footer');
        const footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : window.innerHeight;
        height = Math.max(window.innerHeight, footerTop);

        canva.width = width;
        canva.height = height;

        const oldWorld = { ...world };
        setWorldBounds();

        if (firstTime) {
            fillStarsArea(world.left, world.top, world.right, world.bottom);
        } else {
            if (world.left < oldWorld.left) fillStarsArea(world.left, world.top, oldWorld.left, world.bottom);
            if (world.right > oldWorld.right) fillStarsArea(oldWorld.right, world.top, world.right, world.bottom);
            if (world.top < oldWorld.top) fillStarsArea(world.left, world.top, world.right, oldWorld.top);
            if (world.bottom > oldWorld.bottom) fillStarsArea(world.left, oldWorld.bottom, world.right, world.bottom);

            const want = desiredCount();
            if (stars.length > want) stars.length = want;
            else if (stars.length < want) fillStarsArea(world.left, world.top, world.right, world.bottom);
        }
    }

    function ensureCoverage(parallax) {
        const viewLeft = -window.unicornOffsetX * parallax;
        const viewTop = -window.unicornOffsetY * parallax;
        const viewRight = viewLeft + width;
        const viewBottom = viewTop + height;

        const marginX = bufferX * 0.4;
        const marginY = bufferY * 0.4;

        let expanded = false;
        const old = { ...world };

        if (viewLeft < world.left + marginX) { world.left -= bufferX; expanded = true; }
        if (viewRight > world.right - marginX) { world.right += bufferX; expanded = true; }
        if (viewTop < world.top + marginY) { world.top -= bufferY; expanded = true; }
        if (viewBottom > world.bottom - marginY) { world.bottom += bufferY; expanded = true; }

        if (expanded) {
            if (world.left < old.left) fillStarsArea(world.left, world.top, old.left, world.bottom);
            if (world.right > old.right) fillStarsArea(old.right, world.top, world.right, world.bottom);
            if (world.top < old.top) fillStarsArea(world.left, world.top, world.right, old.top);
            if (world.bottom > old.bottom) fillStarsArea(world.left, old.bottom, world.right, world.bottom);

            const want = desiredCount();
            if (stars.length > want * 1.25) stars.length = Math.floor(want * 1.25);
        }
    }
    function getProbability(percents) {
        return ((Math.floor(Math.random() * 1000) + 1) < percents * 10);
    }
    function getRandInterval(min, max) {
        return (Math.random() * (max - min) + min);
    }
    window.addEventListener('resize', () => windowResizeHandler(false));
}