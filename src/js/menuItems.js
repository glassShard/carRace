export function setMenuItems(navHeight, navList) {
    const scrollPos = window.scrollY + navHeight;
    navList.map(navElem => {
        if (scrollPos >= navElem.top && scrollPos < navElem.bottom) {
            navElem.navItem.classList.add('active');
        } else {
            navElem.navItem.classList.remove('active');
        }
    })
}