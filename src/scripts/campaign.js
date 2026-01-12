import { createBlurBar } from "../components/blurbar/blurbar.js";

export function initCampaign() {
  const container = document.getElementById("campaign");
  if (!container) {
    console.error("No se encontró el contenedor #campaign");
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.width = "100%";
  wrapper.style.maxWidth = "480px";
  wrapper.style.margin = "0 auto";
  wrapper.style.overflow = "hidden";
  wrapper.style.borderRadius = "12px";
  wrapper.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";

  const video = document.createElement("video");
  video.src = "/public/media/autism-campaign.mp4";
  video.controls = false;
  video.autoplay = false;
  video.playsInline = true;
  video.muted = true;
  video.volume = 1.0;
  video.style.width = "100%";
  video.style.height = "auto";
  video.style.display = "block";
  video.style.objectFit = "cover";
  video.style.aspectRatio = "9/16";

  const icons = {
    play: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>`,
    pause: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>`,
    volumeHigh: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z"/></svg>`,
    volumeMute: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z"/></svg>`
  };

  let playBtn, volumeBtn;

  const blurbar = createBlurBar({
    height: 60,
    buttons: [
      {
        icon: icons.play,
        onClick: () => {
          if (video.paused) {
            video.play();
            playBtn.innerHTML = icons.pause;
          } else {
            video.pause();
            playBtn.innerHTML = icons.play;
          }
        }
      },
      {
        icon: icons.volumeMute,
        onClick: () => {
          video.muted = !video.muted;
          volumeBtn.innerHTML = video.muted ? icons.volumeMute : icons.volumeHigh;
        }
      }
    ]
  });

  playBtn = blurbar.querySelectorAll(".blurbar-btn")[0];
  volumeBtn = blurbar.querySelectorAll(".blurbar-btn")[1];

  wrapper.appendChild(video);
  wrapper.appendChild(blurbar);
  container.appendChild(wrapper);
}