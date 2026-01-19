import { initUniverse } from "./universe.js";
import { initPhotos } from "./photos.js";
import { initNavbar } from "./navbar.js";
import { initUnicorn } from "./unicorn.js";
import { initPlancards } from "./plancards.js";
import { initHiddenTabs } from "./hiddenTabs.js";
import { initCampaign } from "./campaign.js";
import { initNews } from "./news.js";

document.addEventListener("DOMContentLoaded", async () => {
    initNavbar();
    initUniverse();
    initPhotos();
    initUnicorn();
    initPlancards();
    initHiddenTabs();
    initCampaign();
    initNews();
});
