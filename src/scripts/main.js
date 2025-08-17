window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  let speedFactor;
  if (window.innerWidth >= 1200) {
    speedFactor = 0.1;
  } else if (window.innerWidth >= 768) {
    speedFactor = 0.07;
  } else {
    speedFactor = 0.045;
  }

  const angle = 24 + scrollY * speedFactor;
  document.body.style.background = `linear-gradient(${angle}deg, #010a13, #22212f, #473545, #0a2036, #030f1c)`;
});

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

  document.getElementById('bar-inicio').style.opacity = '0';
  document.getElementById('bar-planes').style.opacity = '0';
  document.getElementById('bar-contacto').style.opacity = '0';

  if (scrollY < headerHeight + 50) {
    document.getElementById('bar-inicio').style.opacity = '1';
  }
  else if (footerRect.top < windowHeight * 0.6) {
    document.getElementById('bar-contacto').style.opacity = '1';
  }
  else if (
    planesRect.top < windowHeight * 0.5 &&
    planesRect.bottom > windowHeight * 0.25
  ) {
    document.getElementById('bar-planes').style.opacity = '1';
  }
  else {
    document.getElementById('bar-inicio').style.opacity = '1';
  }
}

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

window.addEventListener('scroll', updateNavBarBySection);
window.addEventListener('DOMContentLoaded', updateNavBarBySection);

var starDensity = .15;
var speedCoeff = .03;
var width;
var height;
var starCount;
var first = true;
var giantColor = '180,184,240';
var starColor = '226,225,142';
var cometColor = '226,225,224';
var canva = document.getElementById('universe');
var stars = [];
var lowPerf = false;
var fps = 60;

if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
    lowPerf = true;
    starDensity = 0.1;
    speedCoeff = 0.02;
    fps = 30;
}

windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
createUniverse();

function createUniverse() {
    universe = canva.getContext('2d');
    for (var i = 0; i < starCount; i++) {
        stars[i] = new Star();
        stars[i].reset();
    }
    draw();
}

function draw() {
    universe.clearRect(0, 0, width, height);
    

    var starsLength = stars.length;
    for (var i = 0; i < starsLength; i++) {
        var star = stars[i];
        star.move();
        star.fadeIn();
        star.fadeOut();
        star.draw();
    }
    setTimeout(function () {
        window.requestAnimationFrame(draw);
    }, 1000 / fps);
}

function Star() {
    this.reset = function () {
        this.giant = getProbability(3);
        this.comet = this.giant || first ? false : getProbability(10);
        this.x = getRandInterval(0, width);
        this.y = getRandInterval(0, height);
        this.r = getRandInterval(1.1, 2.6);
        this.dx = getRandInterval(speedCoeff, 6 * speedCoeff) + (this.comet ? speedCoeff * getRandInterval(50, 120) : 0) + speedCoeff * 2;
        this.dy = -getRandInterval(speedCoeff, 6 * speedCoeff) - (this.comet ? speedCoeff * getRandInterval(50, 120) : 0);
        this.fadingOut = null;
        this.fadingIn = true;
        this.opacity = 0;
        this.opacityTresh = getRandInterval(.2, 1 - (this.comet ? .4 : 0));
        this.do = getRandInterval(0.0005, 0.002) + (this.comet ? .001 : 0);
    };

    this.fadeIn = function () {
        if (this.fadingIn) {
            this.fadingIn = this.opacity > this.opacityTresh ? false : true;
            this.opacity += this.do;
        }
    };

    this.fadeOut = function () {
        if (this.fadingOut) {
            this.fadingOut = this.opacity < 0 ? false : true;
            this.opacity -= this.do / 2;
            if (this.x > width || this.y < 0) {
                this.fadingOut = false;
                this.reset();
            }
        }
    };

    this.draw = function () {
        universe.beginPath();

        if (this.giant) {
            universe.fillStyle = 'rgba(' + giantColor + ',' + this.opacity + ')';
            universe.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
        } else if (this.comet) {
            universe.fillStyle = 'rgba(' + cometColor + ',' + this.opacity + ')';
            universe.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, false);

            for (var i = 0; i < 30; i++) {
                universe.fillStyle = 'rgba(' + cometColor + ',' + (this.opacity - (this.opacity / 20) * i) + ')';
                universe.rect(this.x - this.dx / 4 * i, this.y - this.dy / 4 * i - 2, 2, 2);
                universe.fill();
            }
        } else {
            universe.fillStyle = 'rgba(' + starColor + ',' + this.opacity + ')';
            universe.rect(this.x, this.y, this.r, this.r);
        }

        universe.closePath();
        universe.fill();
    };

    this.move = function () {
        this.x += this.dx;
        this.y += this.dy;
        if (this.fadingOut === false) {
            this.reset();
        }
        if (this.x > width || this.y < 0) {
            this.fadingOut = true;
        }
    };

    (function () {
        setTimeout(function () {
            first = false;
        }, 50)
    })()
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
    const footerTop = footer.getBoundingClientRect().top + window.scrollY;
    height = Math.max(window.innerHeight, footerTop);
    starCount = width * starDensity;
    canva.setAttribute('width', width);
    canva.setAttribute('height', height);
}

window.addEventListener('scroll', () => {
    const footer = document.getElementById('footer');
    const footerTop = footer.getBoundingClientRect().top + window.scrollY;
    const newHeight = Math.max(window.innerHeight, window.scrollY + window.innerHeight, footerTop);
    canva.setAttribute('height', newHeight);
    canva.style.height = newHeight + 'px';
    if (newHeight > height) {
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

window.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const spacer = document.querySelector('.header-spacer');
  if (header && spacer) {
    spacer.style.height = header.offsetHeight + 'px';
  }
});
function updateHeaderSpacer() {
  const header = document.querySelector('header');
  const spacer = document.querySelector('.header-spacer');
  if (header && spacer) {
    spacer.style.height = header.offsetHeight + 'px';
  }
}
window.addEventListener('DOMContentLoaded', updateHeaderSpacer);
window.addEventListener('resize', updateHeaderSpacer);

const mediaFiles = [
  "media_1.gif",
  "media_2.png",
  "media_4.jpg"
];

const photosContainer = document.getElementById("photos-welcome");

mediaFiles.forEach(fileName => {
  const filePath = `public/media/${fileName}`;
  const ext = fileName.split('.').pop().toLowerCase();

  let mediaTag = "";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    mediaTag = `<img src="${filePath}" alt="">`;
  } 
  else if (["mp4", "webm", "ogg"].includes(ext)) {
    mediaTag = `
      <video controls>
        <source src="${filePath}" type="video/${ext}">
        Tu navegador no soporta el video.
      </video>
    `;
  }

  const mediaCard = `<div class="media-card">${mediaTag}</div>`;
  photosContainer.innerHTML += mediaCard;
});

(function() {
    const unicorn = document.getElementById('unicorn-toy');
    let posX = 50, posY = 50;
    let velX = 2, velY = 2;
    const friction = 0.99;
    const bounce = 0.8;
    const speedLimit = 15; 

    let dragging = false;
    let offsetX, offsetY;
    let lastMouseX, lastMouseY;
    let lastMoveTime;

    function updatePosition() {
        if (!dragging) {
            posX += velX;
            posY += velY;

            const maxX = window.innerWidth - unicorn.offsetWidth;
            const maxY = window.innerHeight - unicorn.offsetHeight;

            if (posX <= 0 || posX >= maxX) {
                posX = Math.max(0, Math.min(posX, maxX));
                velX = -velX * bounce;
            }
            if (posY <= 0 || posY >= maxY) {
                posY = Math.max(0, Math.min(posY, maxY));
                velY = -velY * bounce;
            }

            velX *= friction;
            velY *= friction;
        }

        unicorn.style.left = posX + 'px';
        unicorn.style.top = posY + 'px';

        requestAnimationFrame(updatePosition);
    }

    unicorn.addEventListener('mousedown', startDrag);
    unicorn.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
        e.preventDefault();
        dragging = true;
        unicorn.style.cursor = 'grabbing';

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        offsetX = clientX - posX;
        offsetY = clientY - posY;
        lastMouseX = clientX;
        lastMouseY = clientY;
        lastMoveTime = Date.now();

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    }

    function onDrag(e) {
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const now = Date.now();
        const deltaTime = now - lastMoveTime;

        velX = (clientX - lastMouseX) / (deltaTime / 16); 
        velY = (clientY - lastMouseY) / (deltaTime / 16);

        velX = Math.max(Math.min(velX, speedLimit), -speedLimit);
        velY = Math.max(Math.min(velY, speedLimit), -speedLimit);

        posX = clientX - offsetX;
        posY = clientY - offsetY;

        lastMouseX = clientX;
        lastMouseY = clientY;
        lastMoveTime = now;
    }

    function endDrag() {
        dragging = false;
        unicorn.style.cursor = 'grab';
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);
    }

    updatePosition();
})();

(function () {
  // ----------------------------- CONFIG ----------------------------------
  const WHATSAPP_URL = "https://wa.me/51967260163?text=Hola,%20estoy%20interesad@%20en%20sus%20servicios."; // ajusta si lo deseas
  const PLANS_ANCHOR = "#planes";

  // Umbrales y tiempos
  const SPEED_LIMIT = 15;
  const LAUNCH_SPEED_THRESHOLD = 9;   // velocidad para considerar un "lanzamiento"
  const COLLISION_COOLDOWN = 600;     // ms para no spamear mensajes al chocar
  const IDLE_INTERVAL = 13000;        // ms entre mensajes idle
  const CLICK_WINDOW = 1100;          // ms para agrupar 1,2,3,4+ clics

  // ------------------------------ FRASES ---------------------------------
  // ➜ Añade/edita frases en cada categoría manteniendo el tono.
  const phrases = {
    onLoad: [
      "¡Hola! te acompañaré mientras estés aquí. 🦄✨",
      "¡Bienvenid@! ¿List@ para jugar conmigo?",
    ],

    dragStart: [
      "¡Sujétame fuerte, que despego! 🚀",
      "¡Uuuh! ¡Vamos a dar una vuelta! 🎢",
      "Con cuidado… soy delicado pero valiente 😌",
      "#Siente el movimiento"
    ],

    dropPlayful: [
      "¡Aterrizaje perfecto! 🛬",
      "¡Eso estuvo cerca! 😵‍💫",
      "¡Qué lanzamiento! Deberías unirte al equipo 😎",
      "Me dejaste con brillantina en el aire ✨"
    ],

    // Choques por borde
    hitLeft: [
      "¡Ouch! La izquierda me abrazó 🔙",
      "Pared izquierda 1 – Unicornio 0",
      "Ok, no más a la izquierda… por ahora 😅"
    ],
    hitRight: [
      "¡Auch! La derecha está dura ➡️",
      "Pared derecha desbloqueada 🧱",
      "Toqué el límite… pero la aventura continúa."
    ],
    hitTop: [
      "¡Ay! El cielo también tiene techo ☁️",
      "Arriba no hay salida… solo estrellas ✨",
      "Me peiné con el techo 🤕"
    ],
    hitBottom: [
      "¡Piso, mi viejo amigo! ⬇️",
      "Aterrizaje con estilo… creo 😬",
      "Parece que el suelo y yo seremos mejores amigos."
    ],

    // Clics
    click1: [
      "¡Hola otra vez! 🙌",
      "¡Hey! ¿Me llamabas?",
      "Podría hacer esto todo el día. 🦸‍♂️"
    ],
    click2: [
      "¡Jajaja! ¡Cosquillas! 😂",
      "¡Ay! ¡Eso hace cosquillas! 😆",
      "No me hagas reír que relincho 🤭"
    ],
    click3: [
      "¡Auxilio! ¡Me atacan a mimos! 😱",
      "¡Exagerado yo? ¡Jamás! 😤 (bueno, un poquito)",
      "¡Tres toques! Esto ya es amor 💘"
    ],
    click4plus: [
      "Ok, creo que necesitas terapia… de juego 😜",
      "Mmm… tanta insistencia. ¿Hablamos? 💬",
      `Tal vez sea hora de elegir uno de nuestros <a href="${PLANS_ANCHOR}">planes</a> 📋`,
      `Si necesitas ayuda, podemos hablar por <a href="${WHATSAPP_URL}" target="_blank">WhatsApp</a> 📲`
    ],

    // Muchos lanzamientos (meta)
    manyLaunches: [
      "Me mareas… en el buen sentido 😵‍💫",
      "Si sigo girando, evoluciono a cometa 🪐",
      `Tal vez sea hora de elegir uno de nuestros <a href="${PLANS_ANCHOR}">planes</a> 📋`,
      `Si necesitas ayuda, podemos hablar por <a href="${WHATSAPP_URL}" target="_blank">WhatsApp</a> 📲`
    ],

    // Idle (mensajes aleatorios cada cierto tiempo)
    idle: [
      `Estamos felices de que estés aquí.🫂`,
      `¿Listo para ver los <a href="${PLANS_ANCHOR}">planes</a>? 📋`,
      `¿Hablamos por <a href="${WHATSAPP_URL}" target="_blank">WhatsApp</a>? 📲`
    ]
  };

  // --------------------------- INFRA DE TEXTO ----------------------------
  const lastShownIndex = {}; // por categoría
  function pick(category, list) {
    if (!list || list.length === 0) return "";
    const last = lastShownIndex[category];
    let idx;
    if (list.length === 1) {
      idx = 0;
    } else {
      do {
        idx = Math.floor(Math.random() * list.length);
      } while (idx === last);
    }
    lastShownIndex[category] = idx;
    return list[idx];
  }

  function showFrom(category, duration = 3500) {
    showBubble(pick(category, phrases[category]), duration);
  }

  // ------------------------------- SETUP ---------------------------------
  const unicorn = document.getElementById("unicorn-toy");
  const bubble = document.getElementById("unicorn-bubble");
  const bubbleText = document.getElementById("bubble-text");

  let posX = 50, posY = 50;
  let velX = 2, velY = 2;
  const friction = 0.99;
  const bounce = 0.8;

  let dragging = false;
  let offsetX, offsetY;
  let lastMouseX, lastMouseY;
  let lastMoveTime;

  // Estado para lógica de mensajes
  let lastCollisionAt = 0;
  let lastCollisionSide = null; // "left" | "right" | "top" | "bottom"
  let launchCount = 0;
  let clickCount = 0;
  let clickTimer = null;
  
  // NUEVO: Control de idle tras colisión
  let allowIdle = true;
  let waitingForIdle = false;

  // --------------------------- BUBBLE RENDER -----------------------------
  function showBubble(html, duration = 3500) {
    bubbleText.innerHTML = html;
    bubble.style.display = "flex";
    // Posicionar junto al unicornio
    bubble.style.left = posX + unicorn.offsetWidth + 12 + "px";
    bubble.style.top = posY - 6 + "px";
    bubble.style.display = "flex";
    clearTimeout(showBubble._t);
    showBubble._t = setTimeout(() => (bubble.style.display = "none"), duration);
  }

  function updateBubblePosition() {
    if (bubble.style.display === "flex") {
      bubble.style.left = posX + unicorn.offsetWidth + 12 + "px";
      bubble.style.top = posY - 6 + "px";
    }
  }

  // ----------------------------- FÍSICA ----------------------------------
  function updatePosition() {
    if (!dragging) {
      posX += velX;
      posY += velY;

      const maxX = window.innerWidth - unicorn.offsetWidth;
      const maxY = window.innerHeight - unicorn.offsetHeight;

      // Detectar choques por lado con mensajes y cooldown
      const now = Date.now();
      const hitLeft = posX <= 0;
      const hitRight = posX >= maxX;
      const hitTop = posY <= 0;
      const hitBottom = posY >= maxY;

      if (hitLeft || hitRight) {
        if (hitLeft) {
          posX = Math.max(0, posX);
          velX = -velX * bounce;
          maybeSayCollision("left", now);
        } else {
          posX = Math.min(posX, maxX);
          velX = -velX * bounce;
          maybeSayCollision("right", now);
        }
      }
      if (hitTop || hitBottom) {
        if (hitTop) {
          posY = Math.max(0, posY);
          velY = -velY * bounce;
          maybeSayCollision("top", now);
        } else {
          posY = Math.min(posY, maxY);
          velY = -velY * bounce;
          maybeSayCollision("bottom", now);
        }
      }

      velX *= friction;
      velY *= friction;
    }

    unicorn.style.left = posX + "px";
    unicorn.style.top = posY + "px";
    updateBubblePosition();

    // NUEVO: Detectar si está quieto tras colisión
    if (waitingForIdle && Math.abs(velX) < 0.5 && Math.abs(velY) < 0.5) {
      allowIdle = true;
      waitingForIdle = false;
    }

    requestAnimationFrame(updatePosition);
  }

  // NUEVO: contador de choques consecutivos
  let collisionCount = 0;

  function maybeSayCollision(side, now) {
    const dt = now - lastCollisionAt;
    const sideChanged = side !== lastCollisionSide;
    const speedMag = Math.hypot(velX, velY);

    if (dt > COLLISION_COOLDOWN || sideChanged || speedMag > LAUNCH_SPEED_THRESHOLD * 1.1) {
      lastCollisionAt = now;
      lastCollisionSide = side;
      allowIdle = false;
      waitingForIdle = true;

      collisionCount++;

      if (collisionCount <= 4) {
        const suffix = collisionCount === 1 ? "" : ` x${collisionCount}`;
        const ouchPhrase = `Ouch${suffix}`;
        showBubble(ouchPhrase, 2000); // <-- usa showBubble directamente
      } else {
        // en el quinto choque (y siguientes): usar frases originales
        collisionCount = 0;
        switch (side) {
          case "left":
            showFrom("hitLeft");
            break;
          case "right":
            showFrom("hitRight");
            break;
          case "top":
            showFrom("hitTop");
            break;
          case "bottom":
            showFrom("hitBottom");
            break;
        }
      }
    }
  }

  // --------------------------- INTERACCIONES -----------------------------
  // Drag
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

    // Mensaje al iniciar drag
    showFrom("dragStart", 1800);
  }

  function onDrag(e) {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const now = Date.now();
    const deltaTime = now - lastMoveTime || 16;

    velX = (clientX - lastMouseX) / (deltaTime / 16);
    velY = (clientY - lastMouseY) / (deltaTime / 16);

    // Limitar velocidad
    velX = Math.max(Math.min(velX, SPEED_LIMIT), -SPEED_LIMIT);
    velY = Math.max(Math.min(velY, SPEED_LIMIT), -SPEED_LIMIT);

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

    // Detectar "lanzamiento" por velocidad al soltar
    const speed = Math.hypot(velX, velY);
    if (speed > LAUNCH_SPEED_THRESHOLD) {
      launchCount++;
      // Reacciones metas/CTAs a partir de varios lanzamientos
      if (launchCount === 3 || launchCount === 5 || launchCount >= 8) {
        showFrom("manyLaunches", 4000);
      } else if (Math.random() < 0.2) {
        // pequeña probabilidad de comentar también
        showFrom("dropPlayful", 4000);
      }
    } else {
      showFrom("dropPlayful", 4000);
    }
  }

  // Clics / taps en secuencia (1,2,3,4+)
  unicorn.addEventListener("click", () => {
    clickCount++;
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      if (clickCount === 1) showFrom("click1", 1800);
      else if (clickCount === 2) showFrom("click2", 2000);
      else if (clickCount === 3) showFrom("click3", 2200);
      else showFrom("click4plus", 2600);

      clickCount = 0;
      clickTimer = null;
    }, CLICK_WINDOW);
  });

  // ----------------------------- CICLOS ----------------------------------
  // Mensaje al cargar
  window.addEventListener("load", () => {
    setTimeout(() => showFrom("onLoad", 4000), 500);
  });

  // Idle (mensajes institucionales + CTA aleatorios)
  setInterval(() => {
    if (allowIdle) showFrom("idle", 3000);
  }, IDLE_INTERVAL);

  // ---------------------------- START LOOP -------------------------------
  requestAnimationFrame(updatePosition);
})();
