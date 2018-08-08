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