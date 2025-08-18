export function initPhotos() {
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
            mediaTag = `<img data-src="${filePath}" alt="" oncontextmenu="return false;" draggable="false">`;
        } else if (["mp4", "webm", "ogg"].includes(ext)) {
            mediaTag = `
            <video controls preload="none" data-src="${filePath}">
                Tu navegador no soporta el video.
            </video>`;
        }

        const mediaCard = `<div class="media-card">${mediaTag}</div>`;
        photosContainer.innerHTML += mediaCard;
    });

    const lazyMedia = photosContainer.querySelectorAll("img[data-src], video[data-src]");
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
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
            }
        });
    }, { rootMargin: "100px" });

    lazyMedia.forEach(el => observer.observe(el));
}
