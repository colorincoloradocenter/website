let gameRunning = false;
let gamePaused = false;
let hasStarted = false;
let difficulty = "easy";
let score = 0;
let timer = 0;
let timerInterval;
let lastTime = 0;


const symbols = ["🧩", "🌈", "🦄", "♾️", "💙", "💛", "💫", "🎧"];
let fallingObjects = [];
let chosenSymbols = [];
let countSymbol = null;
let targetSymbols = [];
let hits = {};
let totalFalling = 0;
let canvas, ctx;
let container;

const btnJugar = document.getElementById("btn-jugar");

const difficultySettings = {
    easy:   { spawnRate: 0.03, speedMin: 1, speedMax: 2, time: 60 },
    medium: { spawnRate: 0.05, speedMin: 2, speedMax: 4, time: 45 },
    hard:   { spawnRate: 0.08, speedMin: 3, speedMax: 6, time: 30 },
};

const difficultyDescriptions = {
    easy: "Eliges 1 símbolo. Ese mismo debes atraparlo y contarlo. Velocidad baja. Tiempo: 60s.",
    medium: "Eliges 2 símbolos: uno para atrapar y otro para contar. Velocidad media. Tiempo: 45s.",
    hard: "Eliges 3 símbolos: dos para atrapar y uno para contar. Velocidad alta. Tiempo: 30s."
};

import { createBlurBar } from "../components/blurbar/blurbar.js";

export function initGame() {
    container = document.querySelector(".juego-container");
    container.insertBefore(document.getElementById("hud"), container.querySelector("#game-canvas"));

    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    const blurbar = createBlurBar({
        height: 70,
        buttons: [
            {   text: "Start",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>',
                onClick: () => startGame() },
            {   text: "Pause", 
                icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>',
                onClick: () => pauseGame() },
            {   text: "Again",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126.5T260-672l57 57q-38 34-57.5 79T240-440q0 88 56 155.5T440-202v80Zm80 0v-80q87-16 143.5-83T720-440q0-100-70-170t-170-70h-3l44 44-56 56-140-140 140-140 56 56-44 44h3q134 0 227 93t93 227q0 121-79.5 211.5T520-122Z"/></svg>',
                onClick: () => restartGame() },
            {   text: "Mode",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M686-132 444-376q-20 8-40.5 12t-43.5 4q-100 0-170-70t-70-170q0-36 10-68.5t28-61.5l146 146 72-72-146-146q29-18 61.5-28t68.5-10q100 0 170 70t70 170q0 23-4 43.5T584-516l244 242q12 12 12 29t-12 29l-84 84q-12 12-29 12t-29-12Zm29-85 27-27-256-256q18-20 26-46.5t8-53.5q0-60-38.5-104.5T386-758l74 74q12 12 12 28t-12 28L332-500q-12 12-28 12t-28-12l-74-74q9 57 53.5 95.5T360-440q26 0 52-8t47-25l256 256ZM472-488Z"/></svg>',
                onClick: () => changeDifficulty() }
        ]
    });
    container.appendChild(blurbar);

    function resizeCanvas() {
        const blurbarHeight = blurbar ? blurbar.offsetHeight : 0;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight - blurbarHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    initDifficultyModal();
    initSymbolClick();
    document.getElementById("btn-volver").addEventListener("click", resetGame);

    btnJugar.addEventListener("click", () => {
        changeDifficulty();
    });

}

function startGame() {
    if (!chosenSymbols.length) { openSymbolSelect(); return; }
    if (gameRunning) return;

    if (gamePaused) {
        gameRunning = true;
        gamePaused = false;
        loop();
        startTimer();
        return;
    }

    gameRunning = true;
    gamePaused = false;
    hasStarted = true;
    score = 0;
    fallingObjects = [];
    hits = {};
    chosenSymbols.forEach(s => hits[s] = 0);
    totalFalling = 0;

    timer = difficultySettings[difficulty].time;
    updateHUD();
    loop();
    startTimer();
}

function pauseGame() {
    gameRunning = false;
    gamePaused = true;
    clearInterval(timerInterval);
}

function restartGame() {
    if (!hasStarted) return;
    clearInterval(timerInterval);
    gameRunning = false;
    gamePaused = false;
    score = 0;
    fallingObjects = [];
    hits = {};
    chosenSymbols.forEach(s => hits[s] = 0);
    totalFalling = 0;
    timer = difficultySettings[difficulty].time;
    updateHUD();
    startGame();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!gameRunning) return;
        timer--;
        updateHUD();
        if (timer <= 0) endGame();
    }, 1000);
}

function changeDifficulty() {
    hasStarted = false;
    chosenSymbols = [];
    targetSymbols = [];
    countSymbol = null;
    totalFalling = 0;
    hits = {};
    document.getElementById("difficulty-modal").classList.remove("hidden");
    
}

function updateHUD() {
    document.getElementById("score-display").textContent = score;
    let diffName = difficulty === "easy" ? "Fácil" :
                    difficulty === "medium" ? "Medio" : "Difícil";
    document.getElementById("difficulty-display").textContent = diffName;
    const baseTime = difficultySettings[difficulty].time;
    document.getElementById("timer-display").textContent = gameRunning ? timer : baseTime;
}

function spawnObject() {
    const settings = difficultySettings[difficulty];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const size = Math.max(24, canvas.width * 0.04);
    ctx.font = `${size}px Arial`;
    const width = ctx.measureText(symbol).width;

    fallingObjects.push({
        symbol,
        x: Math.random() * (canvas.width - width),
        y: -size,
        speed: settings.speedMin + Math.random() * (settings.speedMax - settings.speedMin),
        size,
        width
    });

    if (symbol === countSymbol) totalFalling++;
}
/* 
function loop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < difficultySettings[difficulty].spawnRate) spawnObject();

    fallingObjects.forEach(obj => obj.y += obj.speed);
    fallingObjects.forEach(obj => {
        ctx.font = `${obj.size}px Arial`;c
        ctx.fillText(obj.symbol, obj.x, obj.y);
    });

    fallingObjects = fallingObjects.filter(obj => obj.y <= canvas.height);

    updateHUD();
    requestAnimationFrame(loop);
} */

function loop(timestamp) {
    if (!gameRunning) return;

    if (!lastTime) lastTime = timestamp;
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < difficultySettings[difficulty].spawnRate * delta * 60) {
        spawnObject();
    }

    fallingObjects.forEach(obj => obj.y += obj.speed * delta * 60);

    fallingObjects.forEach(obj => {
        ctx.font = `${obj.size}px Arial`;
        ctx.fillText(obj.symbol, obj.x, obj.y);
    });

    fallingObjects = fallingObjects.filter(obj => obj.y <= canvas.height);

    updateHUD();
    requestAnimationFrame(loop);
}


function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX ?? e.touches[0].clientX) - rect.left;
    const clickY = (e.clientY ?? e.touches[0].clientY) - rect.top;

    for (let i = 0; i < fallingObjects.length; i++) {
        const obj = fallingObjects[i];
        /* if (clickX >= obj.x && clickX <= obj.x + obj.width && clickY >= obj.y && clickY <= obj.y + obj.size) { */
        const padding = 10; // margen extra para hacer más fácil el click
        if (clickX >= obj.x - padding && clickX <= obj.x + obj.width + padding &&
            clickY >= obj.y - obj.size - padding && clickY <= obj.y + padding) {
        if (targetSymbols.includes(obj.symbol)) {
            hits[obj.symbol]++;
            score++;
        }
        fallingObjects.splice(i, 1);
        break;
        }
    }
}

function initSymbolClick() {
    if (!canvas) return;
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchstart", (e) => { e.preventDefault(); handleClick(e); }, false);
}

function initDifficultyModal() {
    const slider = document.getElementById("difficulty-slider");
    if (!slider) return;
    const label = document.getElementById("difficulty-label");
    const closeBtn = document.getElementById("close-modal");

    slider.addEventListener("input", () => {
        const val = parseInt(slider.value);
        if (val === 1) { difficulty = "easy"; label.textContent = "Fácil"; }
        if (val === 2) { difficulty = "medium"; label.textContent = "Medio"; }
        if (val === 3) { difficulty = "hard"; label.textContent = "Difícil"; }
        document.getElementById("difficulty-description").textContent = difficultyDescriptions[difficulty];
        updateHUD();
    });

    closeBtn.addEventListener("click", () => {
        document.getElementById("difficulty-modal").classList.add("hidden");
    });
    }

function openSymbolSelect() {
    const modal = document.getElementById("symbol-select-modal");
    const optionsDiv = document.getElementById("symbol-options");
    const confirmBtn = document.getElementById("confirm-symbols");
    const closeBtn = document.getElementById("close-symbol-modal");

    modal.classList.remove("hidden");
    optionsDiv.innerHTML = "";
    confirmBtn.disabled = true;

    const maxChoices = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
    let selections = [];

    symbols.forEach(sym => {
        const btn = document.createElement("button");
        btn.textContent = sym;
        btn.className = "text-2xl border rounded p-2 hover:bg-blue-200";
        btn.addEventListener("click", () => {
        if (selections.includes(sym)) {
            selections = selections.filter(s => s !== sym);
            btn.classList.remove("bg-blue-300");
        } else if (selections.length < maxChoices) {
            selections.push(sym);
            btn.classList.add("bg-blue-300");
        }
        confirmBtn.disabled = selections.length !== maxChoices;
        });
        optionsDiv.appendChild(btn);
    });

    confirmBtn.onclick = () => {
        modal.classList.add("hidden");
        if (difficulty === "easy") {
        chosenSymbols = [selections[0]];
        targetSymbols = [...chosenSymbols];
        countSymbol = selections[0];
        } else if (difficulty === "medium") {
        chosenSymbols = selections;
        targetSymbols = [selections[0]];
        countSymbol = selections[1];
        } else {
        chosenSymbols = selections;
        targetSymbols = [selections[0], selections[1]];
        countSymbol = selections[2];
        }
        startGame();
    };
    closeBtn.onclick = () => {
        modal.classList.add("hidden");
    };  
}

function endGame() {
    gameRunning = false;
    clearInterval(timerInterval);

    const modal = document.getElementById("endgame-modal");
    const question = document.getElementById("endgame-question");
    const answerInput = document.getElementById("endgame-answer");
    const confirmBtn = document.getElementById("endgame-confirm");

    modal.classList.remove("hidden");
    answerInput.value = "";

    question.textContent = `¿Cuántos ${countSymbol} contaste?`;

    confirmBtn.onclick = () => {
        const userAns = parseInt(answerInput.value);
        modal.classList.add("hidden");

        const counted = targetSymbols.reduce((acc, s) => acc + (hits[s] || 0), 0);
        const perc = counted / totalFalling;
        let success = false;

        if (difficulty === "easy") success = perc >= 0.9 && userAns === totalFalling;
        else if (difficulty === "medium") success = perc >= 0.85 && userAns === totalFalling;
        else success = perc >= 0.8 && userAns === totalFalling;

        alert(success ? "🎉 ¡Felicidades!" : "❌ Inténtalo de nuevo");
    };
}

function resetGame() {
    gameRunning = false;
    gamePaused = false;
    hasStarted = false;
    clearInterval(timerInterval);

    score = 0;
    timer = 0;
    fallingObjects = [];
    chosenSymbols = [];
    countSymbol = null;
    targetSymbols = [];
    hits = {};
    totalFalling = 0;

    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateHUD();

    document.getElementById("juego").classList.add("hidden");
    document.getElementById("inicio").classList.remove("hidden");
}
