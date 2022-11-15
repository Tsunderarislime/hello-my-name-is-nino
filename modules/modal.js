const modal = document.getElementById("history");
const big = document.getElementById("bigImg");
const images = document.getElementById("images");
const mText = document.getElementById("modalText");

export function closeModal() {
    modal.style.display = "none";
    return 0;
};

export function openModal() {
    modal.style.display = "block";
    return 0;
};

//Function to change text
function textChange(vo, ch) {
    mText.innerText = "Volume " + vo + ", Chapter " + ch;

    if (ch == 0) {
        mText.innerText = "Volume " + vo + ", EXTRA chapter";
    };
};

//Function to append past images to the history modal
export function addHist(line) {
    var toAdd = document.createElement("div");

    images.style.display = "block";
    toAdd.className = "smolImg"
    toAdd.setAttribute("id", line[0]);
    toAdd.style.backgroundImage = line[1];
    images.appendChild(toAdd);

    changeHist(line);
};

//Function to change the big image when clicking on one of the small images in the history
export function changeHist(line) {
    big.style.display = "block";
    big.style.backgroundImage = line[1];
    textChange(line[2], line[3]);
};

//Function to reset the history
export function resetHist() {
    big.style.display = "none";
    images.style.display = "none";
    mText.innerText = "NO NINOS?";
    images.replaceChildren();
};