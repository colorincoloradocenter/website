export function initUnicorn(){
    (function () {
        // ------------------------------ CONFIG ---------------------------------
        const SPEED_LIMIT = 18;
        const friction = 0.98;
        const bounce = 0.85;
        const springStrength = 0.1; // fuerza de "liga"
        const maxStretch = 120;     // qué tanto se puede estirar fuera de pantalla

        // ------------------------------- SETUP ---------------------------------
        const unicorn = document.getElementById("unicorn-toy");

        let posX = 200, posY = 200;
        let velX = 0, velY = 0;

        let dragging = false;
        let offsetX, offsetY;
        let lastMouseX, lastMouseY;
        let lastMoveTime;

        // ----------------------------- FÍSICA ----------------------------------
        function updatePosition() {
            if (!dragging) {
            posX += velX;
            posY += velY;

            const maxX = window.innerWidth - unicorn.offsetWidth;
            const maxY = window.innerHeight - unicorn.offsetHeight;

            // --- efecto liga en eje X ---
            if (posX < -maxStretch) posX = -maxStretch;
            if (posX > maxX + maxStretch) posX = maxX + maxStretch;

            if (posX < 0) {
                velX += -posX * springStrength;
            } else if (posX > maxX) {
                velX += (maxX - posX) * springStrength;
            }

            // --- efecto liga en eje Y ---
            if (posY < -maxStretch) posY = -maxStretch;
            if (posY > maxY + maxStretch) posY = maxY + maxStretch;

            if (posY < 0) {
                velY += -posY * springStrength;
            } else if (posY > maxY) {
                velY += (maxY - posY) * springStrength;
            }

            // fricción + rebotes más suaves
            velX *= friction;
            velY *= friction;

            // limitar velocidad
            velX = Math.max(Math.min(velX, SPEED_LIMIT), -SPEED_LIMIT);
            velY = Math.max(Math.min(velY, SPEED_LIMIT), -SPEED_LIMIT);
            }

            unicorn.style.left = posX + "px";
            unicorn.style.top = posY + "px";

            requestAnimationFrame(updatePosition);
        }

        // --------------------------- INTERACCIONES -----------------------------
        unicorn.addEventListener("mousedown", startDrag);
        unicorn.addEventListener("touchstart", startDrag, { passive: false });

        function startDrag(e) {
            e.preventDefault();
            dragging = true;
            unicorn.style.cursor = "grabbing";

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            offsetX = clientX - posX;
            offsetY = clientY - posY;
            lastMouseX = clientX;
            lastMouseY = clientY;
            lastMoveTime = Date.now();

            document.addEventListener("mousemove", onDrag);
            document.addEventListener("touchmove", onDrag, { passive: false });
            document.addEventListener("mouseup", endDrag);
            document.addEventListener("touchend", endDrag);
        }

        function onDrag(e) {
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const now = Date.now();
            const deltaTime = now - lastMoveTime || 16;

            velX = (clientX - lastMouseX) / (deltaTime / 16);
            velY = (clientY - lastMouseY) / (deltaTime / 16);

            posX = clientX - offsetX;
            posY = clientY - offsetY;

            lastMouseX = clientX;
            lastMouseY = clientY;
            lastMoveTime = now;
        }

        function endDrag() {
            dragging = false;
            unicorn.style.cursor = "grab";
            document.removeEventListener("mousemove", onDrag);
            document.removeEventListener("touchmove", onDrag);
            document.removeEventListener("mouseup", endDrag);
            document.removeEventListener("touchend", endDrag);
        }

        // ---------------------------- START LOOP -------------------------------
        requestAnimationFrame(updatePosition);
    })();
}