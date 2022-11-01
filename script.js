import { parse } from './modules/index-min.js'
import { alter } from './modules/panel.js'

//Function to wait a set amount of milliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

//Update the score value
function updateScore() {
    document.getElementById("current").innerText = "Your current score is: " + score;
    if (score > hScore) {
        hScore = score;
        document.getElementById("highest").innerText = "Your highest score is: " + hScore;
        document.cookie = hScore;
    };
};

//Function for initializing
function init() {
    document.getElementById("check").checked = false;
    score = 0;
    vCount = 0;
    cCount = 0;

    updateScore();
    unseen = Array.from({length: nino.length - 1}, (_, i) => i + 1);
    seen = [];
    choosePage();
    document.getElementById("results").style.display = "none";
    document.getElementById("answer").style.display = "block";
}

//Function for choosing a random page from the database
function choosePage() {
    var go = unseen.length;
    if (go > 0) {
        document.getElementById("check").checked = false;
        var rng = Math.floor(Math.random() * unseen.length);
        id = unseen[rng];
        seen.push(unseen[rng]);
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

    var advance = true;
    var noclick = document.getElementById("noclick");
    noclick.addEventListener("click", function() {
        advance = false;
    });

    while (advance) {
        await sleep(10);
    };

    document.getElementById("results").style.display = "none";
    document.getElementById("answer").style.display = "block";
    choosePage();
};

//Function for checking if the volume/chapter was correct
async function verify(e) {
    var n;
    var t = "WRONG"
    var vc;

    //Volume or chapter?
    if (e.currentTarget.volume) {
        //Volume
        n = document.getElementById("inVo").value
        vc = " VOLUME!"
        vCount += 1;
        if (n == nino[id][2]) {
            score += 1;
            t = "CORRECT"
        };
    } else {
        //Chapter
        n = document.getElementById("inCh").value
        vc = " CHAPTER!"
        cCount += 1;
        if (n == nino[id][3]) {
            score += 5;
            t = "CORRECT"
        };
    };

    //Show the results
    document.getElementById("check").checked = true;
    await sleep(1000); //The reveal of the full page takes 1 second
    updateScore();
    await results(t, vc);
};

//Function for starting/restarting the game
function startGame() {
    switch (start.innerText) {
        case "Start":
            document.getElementById("game").style.display = "block";
            start.innerText = "End";
            document.getElementById("highest").innerText = "Your highest score is: " + hScore;
            document.getElementById("highest2").remove()
            init();
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
            document.getElementById("current").style.display = "block";
    document.getElementById("highest").style.display = "block";
            init();
        default:
            break;
    };
};

//Function for ending the game
async function endGame() {
    document.getElementById("answer").style.display = "none";
    document.getElementById("gameover").style.display = "block";

    document.getElementById("current").style.display = "none";
    document.getElementById("highest").style.display = "none";

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
var seen;  //IDs of all Ninos that have been seen
var score;
var hScore;
var id;
var vCount;
var cCount;

const sendVo = document.getElementById("sendVo");
sendVo.addEventListener("click", verify, false);
sendVo.volume = true;

const sendCh = document.getElementById("sendCh");
sendCh.addEventListener("click", verify, false);
sendCh.volume = false;

const start = document.getElementById("start");
start.addEventListener("click", startGame, false);

window.addEventListener("load", function() {
    if (document.cookie == "") {
        document.cookie = 0;
    };
    hScore = document.cookie;

    document.getElementById("highest2").innerText = "Your highest score is: " + hScore;
});