export function createBlurBar({ height = 60, buttons = [] } = {}) {
  const blurbar = document.createElement("div");
  blurbar.className = "blurbar";
  blurbar.style.height = `${height}px`;

  buttons.forEach(btn => {
    const buttonEl = document.createElement("button");
    buttonEl.className = "blurbar-btn";

    if (btn.keepText) {
      buttonEl.classList.add("keep-text");
    }

    if (btn.icon) {
      buttonEl.innerHTML = `
        ${btn.icon}
        ${btn.text ? `<span>${btn.text}</span>` : ""}
      `;
    } else {
      buttonEl.innerHTML = `<span>${btn.text || ""}</span>`;
    }

    if (btn.onClick) {
      buttonEl.addEventListener("click", btn.onClick);
    }

    blurbar.appendChild(buttonEl);
  });

  return blurbar;
}
