let lastKnownScrollPosition = 0;

let jatek = false;
let jotudni = false;
let autok = false;
let arajanlat = false;
let kapcsolat = false;
let referenciak = false;

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
    if (!arajanlat) {
        setAnimation('arajanlat', 200, 'fromLeft');
        setAnimation('arajanlat', 200, 'fromRight');
    }
    if (!kapcsolat) {
        setAnimation('kapcsolat', 200, 'fromTop');
    }
    if (!referenciak) {
        setAnimation('referenciak', 200, 'fromBottom');
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
        if (divId === 'arajanlat') {
            arajanlat = true;
        }
        if (divId === 'kapcsolat') {
            kapcsolat = true;
        }
        if (divId === 'referenciak') {
            referenciak = true;
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