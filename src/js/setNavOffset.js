export function setNavOffset(navItems, navList) {
    navItems.forEach(navItem => {
        const id = navItem.getAttribute('href').slice(1);
        const section = document.getElementById(id);
        if (section) {
            const navElem = {
                'navItem': navItem,
                'top': section.offsetTop,
                'bottom': section.offsetTop + section.offsetHeight
            };
            navList.push(navElem);
        }
    });
}
