import {setMenuItems} from "./menuItems";
import {setDivs} from "./animationOnload";
import {inputChanged} from "./offer";
import {scrollTo} from "./scrollTo";
import {sendEmail} from "./sendOrder";
import {setNavOffset} from "./setNavOffset";

let navHeight = 0;

let navList = [];

let debounced = false;

function scroll(e) {
    e.preventDefault();

    try {
        const to = document.getElementById(this.hash.slice(1)).offsetTop - navHeight;
        scrollTo(document.documentElement, to, 500);
    } catch {
        console.warn(`${this.hash.slice(1)} element does not exists`);
    }
}

function onScroll(navHeight, navList) {
    if (!debounced) {
        debounced = true;
        const timeOut = setTimeout(() => {
            debounced = false;
            setDivs();
            setMenuItems(navHeight, navList);
        }, 100);
    }
}

function closeMenu() {
    const collapsing = document.querySelector('.navbar-collapse');
    const toggler = document.querySelector('.navbar-toggler');
    if (collapsing.classList.contains('show')) {
        toggler.classList.add('collapsed');
        toggler.setAttribute('aria-expanded', false);
        collapsing.classList.remove('show');
    }
}

document.addEventListener("DOMContentLoaded", function(event) {

    console.log("DOM fully loaded and parsed");

    navHeight = document.querySelector('nav').offsetHeight;
    document.querySelector('header').style.height = (window.innerHeight - navHeight) + 'px';

    document.body.style.paddingTop = navHeight + 'px';

    document.querySelector('.types').style.maxHeight = 0;
    document.querySelector('.pieces').style.maxHeight = 0;
    document.querySelector('.price').style.maxHeight = 0;

    const navItems = document.querySelectorAll('.nav-link');
    setNavOffset(navItems, navList);

    let data = '';
    let peopleInterval = [];
    const changes = new Event('changes');

    fetch('http://localhost:8080/cars.json')
        .then(response => response.json())
        .then(response => {
            data = response;
            peopleInterval = data.reduce((acc, curr) => {
                if (curr.cars[0].peopleMin <= acc[0]) {
                    acc[0] = curr.cars[0].peopleMin;
                }
                if (curr.cars[curr.cars.length - 1].peopleMax >= acc[1]) {
                    acc[1] = curr.cars[curr.cars.length - 1].peopleMax;
                }
                return acc;
            }, [1000000, 0]);
            document.getElementById('errorMessage').innerHTML =
                `A létszámnak ${peopleInterval[0]} és ${peopleInterval[1]} között kell lenni!`;
        });

    const calcInput = document.querySelector('.calcInput');

    calcInput.addEventListener('input', (e) => inputChanged(e, data, peopleInterval, changes));

    setMenuItems(navHeight, navList);
    setDivs();
    window.addEventListener('scroll', (e) => onScroll(navHeight, navList));
    navItems.forEach((navItem) => navItem.addEventListener('click', scroll));

    document.querySelector('#sendOrder').addEventListener('click', (e) => sendEmail(e, 'order'));
    document.querySelector('#sendMessage').addEventListener('click', (e) => sendEmail(e, 'message'));
    document.querySelector('#arajanlat').addEventListener('changes', (e) => setNavOffset(navItems, navList));
    document.querySelectorAll('.nav-link').forEach(navLink => navLink.addEventListener('click', closeMenu));
});


