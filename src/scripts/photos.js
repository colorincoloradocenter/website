
import { createBlurBar } from "../components/blurbar/blurbar.js";

export function initPhotos() {

  const mediaFiles = [
    "media_2.png",
    "media_1.gif",
    "media_4.jpg"
  ];

  const servicios = [
    "Evaluación psicológica",
    "Asistencia psicológica (Ansiedad, depresión, dependencia, duelo, autoestima, estrés, ira)",
    "Terapia de lenguaje",
    "Terapia de atención y concentración",
    "Terapia de modificación de la conducta",
    "Terapia de aprendizaje",
    "Terapia de pareja y familiar",
    "Orientación vocacional",
    "Integración sensorial",
    "Terapia Ocupacional"
  ];

  const modalContents = [
    `Hola`,
    `
    <form id="servicios-form">
      <div>
        ${servicios.map((serv, i) => `
          <label>
            <input type="radio" name="servicio" value="${serv}" ${i === 0 ? "checked" : ""}>
            <span>${serv.replace(/([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(?=\s|\(|$)/g, "<b>$1</b>")}</span>
          </label>
        `).join("")}
      </div>
      <button type="submit" id="btn-interesa">Me interesa</button>
    </form>
    `,
    `Holaaaaaa`
  ];

  const modal = document.getElementById('media-modal');
  const modalBody = document.getElementById('media-modal-body');
  const closeBtn = document.querySelector('.media-modal-close');

  const buttonLabels = [
    {   
        text: "",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-240q80 0 152-30t128-86l-42-42q-11 11-21.5 19.5T674-362l-34-58v-100h40v-40H456l-70-120H240l40 30-60 70 38 40 62-40v160l-34 58q-12-8-22.5-16.5T242-398l-42 42q56 56 128 86t152 30Zm0-60q-38 0-73.5-7.5T338-332l34-58q26 10 53.5 14.5T480-371q28 0 55-4.5t53-14.5l34 58q-33 15-68.5 23.5T480-300ZM160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v640q0 33-23.5 56.5T800-80H160Zm0-80h640v-640H160v640Zm0 0v-640 640Z"/></svg>',
        onClick: (e) => launchConfetti(e.currentTarget, 'unicorn')},
    { 
        text: "Nuestros servicios", 
        icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M491-339q70 0 119-45t49-109q0-57-36.5-96.5T534-629q-47 0-79.5 30T422-525q0 19 7.5 37t21.5 33l57-57q-3-2-4.5-5t-1.5-7q0-11 9-17.5t23-6.5q20 0 33 16.5t13 39.5q0 31-25.5 52.5T492-418q-47 0-79.5-38T380-549q0-29 11-55.5t31-46.5l-57-57q-32 31-49 72t-17 86q0 88 56 149.5T491-339ZM240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Z"/></svg>',
        keepText: true,
        onClick: () => {
        modalBody.innerHTML = modalContents[1];
        modal.classList.remove('hidden');
        const form = document.getElementById('servicios-form');
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const servicio = form.servicio.value;
            const mensaje = encodeURIComponent(`Me interesa el servicio "${servicio}", quisiera más información, por favor.`);
            const wspLink = `https://api.whatsapp.com/send?phone=+51967260163&text=${mensaje}`;
            window.open(wspLink, '_blank');
        });
      }
    },
    { 
        text: "",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M352-120H200q-33 0-56.5-23.5T120-200v-152q48 0 84-30.5t36-77.5q0-47-36-77.5T120-568v-152q0-33 23.5-56.5T200-800h160q0-42 29-71t71-29q42 0 71 29t29 71h160q33 0 56.5 23.5T800-720v160q42 0 71 29t29 71q0 42-29 71t-71 29v160q0 33-23.5 56.5T720-120H568q0-50-31.5-85T460-240q-45 0-76.5 35T352-120Zm-152-80h85q24-66 77-93t98-27q45 0 98 27t77 93h85v-240h80q8 0 14-6t6-14q0-8-6-14t-14-6h-80v-240H480v-80q0-8-6-14t-14-6q-8 0-14 6t-6 14v80H200v88q54 20 87 67t33 105q0 57-33 104t-87 68v88Zm260-260Z"/></svg>',
        onClick: (e) => launchConfetti(e.currentTarget, 'puzzle') 
    }
  ];

  const photosContainer = document.getElementById("photos-welcome");

  mediaFiles.forEach((fileName, idx) => {
    const filePath = `public/media/${fileName}`;
    const ext = fileName.split('.').pop().toLowerCase();

    let mediaTag = "";
    if (["jpg","jpeg","png","gif","webp"].includes(ext)) {
      mediaTag = `<img data-src="${filePath}" alt="" oncontextmenu="return false;" draggable="false">`;
    } else if (["mp4","webm","ogg"].includes(ext)) {
      mediaTag = `<video controls preload="none" data-src="${filePath}"></video>`;
    }

    const card = document.createElement("div");
    card.className = "media-card";
    card.innerHTML = mediaTag;

    const blurbar = createBlurBar({
      height: 60,
      buttons: [buttonLabels[idx]]
    });

    card.appendChild(blurbar);
    photosContainer.appendChild(card);
  });

  const lazyMedia = photosContainer.querySelectorAll("img[data-src], video[data-src]");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.tagName === "IMG") {
        el.src = el.dataset.src;
      } else if (el.tagName === "VIDEO") {
        const src = el.dataset.src;
        const source = document.createElement("source");
        source.src = src;
        source.type = `video/${src.split('.').pop()}`;
        el.appendChild(source);
      }
      el.removeAttribute("data-src");
      obs.unobserve(el);
    });
  }, { rootMargin: "100px" });
  lazyMedia.forEach(el => observer.observe(el));

  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('hidden') && e.key === "Escape") modal.classList.add('hidden');
  });

  function launchConfetti(target, type) {
    const emojis = type === 'unicorn'
      ? ["✨","🌟","💫","⭐","🦄","🌈"]
      : ["🧩","♾️","🎧","💙","🩵","💛"];

    const count = 6;
    const rect = target.getBoundingClientRect();
    const container = document.createElement('div');
    container.className = 'confetti-container';
    container.style.left = (rect.left + rect.width / 2) + 'px';
    container.style.top  = (rect.top  + rect.height / 2) + 'px';
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.className = 'confetti-emoji';
      span.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const angle = Math.random() * 2 * Math.PI;
      const distance = 80 + Math.random() * 300;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance + 200;
      const rotation = 180 + Math.random() * 360;
      const scale = 0.6 + Math.random() * 0.8;
      const duration = 1.8 + Math.random() * 0.5;

      span.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
      span.style.opacity = 1;
      span.style.setProperty("--x", `${x}px`);
      span.style.setProperty("--y", `${y}px`);
      span.style.setProperty("--r", `${rotation}deg`);
      span.style.setProperty("--s", scale);
      span.style.animation = `confetti ${duration}s ease-out forwards`;

      span.addEventListener("animationend", () => {
        span.remove();
        if (i === count - 1) container.remove();
      });

      container.appendChild(span);
    }
  }
}

