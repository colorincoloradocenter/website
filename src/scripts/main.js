import { initUniverse } from "./universe.js";
import { initPhotos } from "./photos.js";
import { initNavbar } from "./navbar.js";
import { initUnicorn } from "./unicorn.js";
import { initPlancards } from "./plancards.js";

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initUniverse();
    initPhotos();
    initUnicorn();
    initPlancards();
});