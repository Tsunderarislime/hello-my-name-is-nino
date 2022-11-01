//Add px to number
function px(n) {
    return n + "px"
}

//Background position: -left -top
function pos(l, t) {
    return "-" + px(l) + " " + "-" + px(t);
};

//Function to replace the current page with a new page
//Input one row from the CSV
export function alter(line) {
    document.getElementById("underlay").style.backgroundImage = line[1];
    document.getElementById("overlay").style.backgroundImage = line[1];
    document.getElementById("overlay").style.left = px(line[4]);
    document.getElementById("overlay").style.top = px(line[5]);
    document.getElementById("overlay").style.width = px(line[6]);
    document.getElementById("overlay").style.height = px(line[7]);
    document.getElementById("overlay").style.backgroundPosition = pos(line[4], line[5]);
};
