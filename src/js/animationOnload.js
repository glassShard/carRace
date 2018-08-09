let lastKnownScrollPosition = 0;

let jatek = false;
let jotudni = false;
let autok = false;

export function setDivs() {
    lastKnownScrollPosition = window.scrollY;
    if (!jatek) {
        setAnimation('jatek', 200, 'fromTop');
    }
    if (!jotudni) {
        setAnimation('jotudni', 200, 'fromLeft');
        setAnimation('jotudni', 200, 'fromRight');
    }
    if (!autok) {
        setAnimation('autok', 200, 'fromBottom');
    }
}

export function setAnimation(divId, deltaPixel, className) {
    if (lastKnownScrollPosition > document.getElementById(divId).offsetTop + deltaPixel - window.innerHeight) {
        if (divId === 'jatek') {
            jatek = true;
        }
        if (divId === 'jotudni') {
            jotudni = true;
        }
        if (divId === 'autok') {
            autok = true;
        }
        const cards = document.getElementById(divId).getElementsByClassName(className);
        let step = 0;
        const start = setInterval(() => {
            if (step >= cards.length) {
                clearInterval(start);
            } else {

                cards[step].classList.add('inPlace');
                step++;
            }
        }, 200);
    }
}