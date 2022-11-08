//Read cookie
export function readCookie(cname) {
    var c = document.cookie;
    var sub = c.split(',');
    switch (cname) {
        case "hScore":
            return sub[0];
            break;
        case "hCombo":
            return sub[1];
            break;
        default:
            return 0;
            break;
    };
}

//Write cookie
export function writeCookie(score, streak) {
    var hSc = score + ",";
    var hSt = streak + ";";
    var d = new Date();

    d.setTime(d.getTime() + (14*24*60*60*1000)); //Expire in 2 weeks
    var expires = "expires="+ d.toUTCString();
    var together = hSc + hSt + expires + ";path=/";
    document.cookie = together;
}