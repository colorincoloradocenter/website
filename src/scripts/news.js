export function initNews() {
    const phone = "51967260163";

    const mensaje = encodeURIComponent(
    "Hola 👋, estoy interesado(a) en el Programa Pre-Kinder 2026. ¿Podrían brindarme más información, por favor?"
    );

    const wspLink = `https://api.whatsapp.com/send?phone=${phone}&text=${mensaje}`;

    const prekinderCaption = document.querySelector(".js-wsp-prekinder");

    if (prekinderCaption) {
        prekinderCaption.style.cursor = "pointer";
        prekinderCaption.addEventListener("click", () => {
            window.open(wspLink, "_blank");
        });
    }

    const photos = [
        "4b1dd361-2d52-425d-b6cc-8b7336ead28a.jpg",
        "5db8befd-2647-4f5a-b730-222c8e73964e.jpg",
        "0c1fbcd6-7d9f-47ac-b3dd-1f91b6c8b51b.jpg",
        "039e6761-d34e-4b86-943c-bdf914a6ad27.jpg",
        "6069d184-6e32-4972-83fc-11f623ad8039.jpg",
        "75046d80-d822-401b-b973-d094eafbe9bb.jpg",
        "c2db7274-b4db-4ff5-9643-01b7a3f783d7.jpg",
        "c71c7e6d-76aa-4ff4-9416-57fc7dd08c3f.jpg",
        "c91d2e50-b2c0-4f2a-ac6d-9f2350d2ddd8.jpg",
        "e5d69fa5-855d-4992-82e1-454a88a75b01.jpg"
    ];

    const track = document.querySelector(".news-track");
    const btnPrev = document.querySelector(".news-nav.prev");
    const btnNext = document.querySelector(".news-nav.next");
    const btnBack = document.querySelector(".news-back-btn");


    if (!track) return;

    photos.forEach((file, i) => {
        const slide = document.createElement("article");
        slide.className = "news-slide";

        const src = `public/media/news/photos/${file}`;

        slide.innerHTML = `
            <div class="news-image">
                <img class="news-img blur" src="${src}" alt="" aria-hidden="true">
                <img class="news-img main" src="${src}" alt="Noticia ${i + 2}"
                draggable="false" oncontextmenu="return false">
            </div>
        `;

        track.appendChild(slide);
    });

    let index = 0;
    const total = track.children.length;

function update() {
    track.style.transform = `translateX(-${index * 100}%)`;

    if (btnBack) {
        btnBack.classList.toggle("visible", index >= 1);
    }
}

btnBack.addEventListener("click", () => {
    index = 0;
    update();
});

    btnNext.addEventListener("click", () => {
        index = (index + 1) % total;
        update();
    });

    btnPrev.addEventListener("click", () => {
        index = (index - 1 + total) % total;
        update();
    });

    let startX = 0;
    let isDragging = false;

    const slider = document.querySelector(".news-slider");


    slider.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    slider.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            diff > 0
            ? btnNext.click()
            : btnPrev.click();
        }
    });

    slider.addEventListener("mousedown", e => {
        isDragging = true;
        startX = e.clientX;
        slider.style.cursor = "grabbing";
        });

        window.addEventListener("mouseup", e => {
        if (!isDragging) return;

        isDragging = false;
        slider.style.cursor = "default";

        const diff = startX - e.clientX;

        if (Math.abs(diff) > 80) {
            diff > 0
            ? btnNext.click()
            : btnPrev.click();
        }
    });
}