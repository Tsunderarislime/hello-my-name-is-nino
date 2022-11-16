import { parse } from './modules/index-min.js'
import { alter } from './modules/panel.js'
import { readCookie, writeCookie } from './modules/cookie.js'
import { closeModal, openModal, addHist, changeHist, resetHist } from './modules/modal.js'

//Function to wait a set amount of milliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

//Function to set combo value
function setCombo(flag) {
    if (flag) {
        combo += 1;
    } else {
        combo = 0;
    };
    document.getElementById("currentCombo").innerText = "Your current combo is: " + combo;

    if (combo > hCombo) {
        hCombo = combo;
        document.getElementById("highestCombo").innerText = "Your highest combo is: " + hCombo;
        writeCookie(hScore, hCombo);
    };
};

//Function to interpret combo value gains
function comboBonus(flag) {
    const v = [0, 0, 1, 2, 3, 4];
    const c = [0, 0, 2, 5, 7, 10];
    var dex = combo;
    if (dex > 5) {
        dex = 5;
    };

    //true = volumes, false = chapters
    if (flag) {
        return v[dex];
    } else {
        return c[dex];
    };
};

//Function for updating the score
function updateScore(bonus) {
    score += bonus;
    document.getElementById("current").innerText = "Your current score is: " + score;
    if (score > hScore) {
        hScore = score;
        document.getElementById("highest").innerText = "Your highest score is: " + hScore;
        writeCookie(hScore, hCombo);
    };
};

//Function for initializing
function init() {
    document.getElementById("check").checked = false;
    score = 0;
    vCount = 0;
    cCount = 0;
    total = 0;

    setCombo(false);
    updateScore(0);
    unseen = Array.from({length: nino.length - 1}, (_, i) => i + 1);
    choosePage();
    document.getElementById("results").style.display = "none";
    document.getElementById("answer").style.display = "block";
}

//Function for choosing a random page from the database
function choosePage() {
    var go = unseen.length;
    total += 1;
    document.getElementById("ninoCount").innerText = total + "/199";
    if (go > 0) {
        document.getElementById("check").checked = false;
        var rng = Math.floor(Math.random() * unseen.length);
        id = unseen[rng];
        unseen.splice(rng, 1);
        alter(nino[id]);
    } else {
        endGame();
    };
};

//Function for displaying results of a round
async function results(t, vc) {
    //Replace the answer box with this box
    document.getElementById("wrongCorrect").innerText = "YOU CHOSE THE " + t + vc;
    document.getElementById("where").innerText = "This Nino can be found in Volume " + nino[id][2] + ", Chapter " + nino[id][3] + ". Click the panel to continue.";
    document.getElementById("answer").style.display = "none";
    document.getElementById("results").style.display = "block";

    if (nino[id][3] == 0) {
        document.getElementById("where").innerText = "This Nino can be found in Volume " + nino[id][2] + ", EXTRA chapter. Click the panel to continue.";
    };

    var advance = true;
    var noclick = document.getElementById("noclick");
    noclick.addEventListener("click", function() {
        advance = false;
    });

    addHist(nino[id]);

    while (advance) {
        start.disabled = true;
        await sleep(10);
    };


    sendVo.disabled = false;
    sendCh.disabled = false;
    start.disabled = false;
    document.getElementById("results").style.display = "none";
    document.getElementById("answer").style.display = "block";
    choosePage();
};

//Function for checking if the volume/chapter was correct
async function verify(e) {
    var n;
    var t = "WRONG"
    var vc;
    var cFlag;
    var type;
    var add = 0;

    sendVo.disabled = true;
    sendCh.disabled = true;

    //Volume or chapter?
    if (e.currentTarget.volume) {
        //Volume
        n = document.getElementById("inVo").value
        vc = " VOLUME!"
        vCount += 1;
        type = true;

        if (n == nino[id][2]) {
            add = 1;
            t = "CORRECT"
            cFlag = true;
        } else {
            cFlag = false;
        };
    } else {
        //Chapter
        n = document.getElementById("inCh").value
        vc = " CHAPTER!"
        cCount += 1;
        type = false;
        
        if (n == nino[id][3]) {
            add = 5;
            t = "CORRECT"
            cFlag = true;
        } else {
            cFlag = false;
        };
    };

    //Show the results
    document.getElementById("check").checked = true;
    await sleep(1000); //The reveal of the full page takes 1 second
    setCombo(cFlag);
    add += comboBonus(type);
    updateScore(add);
    await results(t, vc);
};

//Function for starting/restarting the game
function startGame() {
    switch (start.innerText) {
        case "Start":
            document.getElementById("game").style.display = "block";
            start.innerText = "End";
            document.getElementById("highest").innerText = "Your highest score is: " + hScore;
            document.getElementById("highestCombo").innerText = "Your highest combo is: " + hCombo;
            document.getElementById("highest2").remove();
            document.getElementById("highestCombo2").remove();
            init();
            document.getElementById("info").style.display = "block";
            break;
        case "End":
            if(confirm("End the current game?")) {
                endGame();
            };
            break;
        case "Restart":
            start.innerText = "End";
            document.getElementById("gameover").style.display = "none";
            document.getElementById("answer").style.display = "block";
            document.getElementById("info").style.display = "block";
            resetHist();
            init();
        default:
            break;
    };
};

//Function for ending the game
async function endGame() {
    document.getElementById("answer").style.display = "none";
    document.getElementById("gameover").style.display = "block";

    document.getElementById("info").style.display = "none";

    document.getElementById("fScore").innerText = "FINAL SCORE: " + score;
    document.getElementById("fHigh").innerText = "HIGH SCORE: " + hScore;

    document.getElementById("vCount").innerText = "You guessed volumes " + vCount + " time(s)."
    document.getElementById("cCount").innerText = "You guessed chapters " + cCount + " time(s)."

    start.innerText = "Restart";
};

//Load in the Nino face CSV
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "./nino/nino.csv", false);
xmlhttp.send();
var csv = xmlhttp.responseText
const nino = parse(csv);

//Initial game state
var unseen; //IDs of all Ninos that have not been seen

var score; //Score and high score
var hScore;

var combo; //Combo and highest combo
var hCombo;

var id; //id of current Nino
var vCount; //Volume count
var cCount; //Chapter count
var total; //Total Ninos identified

const sendVo = document.getElementById("sendVo");
sendVo.addEventListener("click", verify, false);
sendVo.volume = true;

const sendCh = document.getElementById("sendCh");
sendCh.addEventListener("click", verify, false);
sendCh.volume = false;

const start = document.getElementById("start");
start.addEventListener("click", startGame, false);

const modal = document.getElementById("history");
modal.addEventListener("click", function(e) {
    if (e.target == this) {
        closeModal();
    };
});

const open = document.getElementById("open")
open.addEventListener("click", openModal, false);

const img = document.getElementById("images");
img.addEventListener("click", function(e) {
    var hit = e.target.getAttribute("id");
    if (!(isNaN(hit))) {
        changeHist(nino[hit]);
    };
});

const beeg = document.getElementById("bigImg");
beeg.addEventListener("click", function(e) {
    var link = "." + this.style.backgroundImage.split('.')[1] + ".jpg";
    window.open(link, '_blank').focus();
});

window.addEventListener("load", function() {
    if (document.cookie == "") {
        writeCookie(0, 0);
    };
    hScore = readCookie("hScore");
    hCombo = readCookie("hCombo");

    document.getElementById("highest2").innerText = "Your highest score is: " + hScore;
    document.getElementById("highestCombo2").innerText = "Your highest combo is: " + hCombo;
});