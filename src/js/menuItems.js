export function setMenuItems(navHeight, navList) {
    const scrollPos = window.scrollY + navHeight;
    navList.map(navElem => {
        if (scrollPos >= navElem.top - 1 && scrollPos < navElem.bottom - 1) {
            navElem.navItem.classList.add('active');
        } else {
            navElem.navItem.classList.remove('active');
        }
    })
}