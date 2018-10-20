import '../css/style.scss';

import {setMenuItems} from "./menuItems";
import {setDivs} from "./animationOnload";
import {inputChanged} from "./offer";
import {scrollTo} from "./scrollTo";
import {sendEmail} from "./sendOrder";
import {setNavOffset} from "./setNavOffset";
import "../img/favi/favicons";

let navHeight = 0;

let navList = [];

let debounced = false;

function scroll(e) {
    e.preventDefault();

    try {
        const to = document.getElementById(this.hash.slice(1)).offsetTop - navHeight;
        const element = document.scrollingElement ? document.scrollingElement : document.body;
        scrollTo(element, to, 500);
    } catch(error) {
        console.warn(`${this.hash.slice(1)} element does not exist`);
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
    if (document.querySelector('.navbar-collapse').classList.contains('show')) {
        closeMenuIfOpen();
    }
}

    function closeMenuIfOpen() {
        const toggler = document.querySelector('.navbar-toggler');
        toggler.classList.add('collapsed');
        toggler.setAttribute('aria-expanded', false);
        document.querySelector('.navbar-collapse').classList.remove('show');
    }

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");

    navHeight = document.querySelector('nav').offsetHeight;

    const navItems = document.querySelectorAll('.nav-link');
    setNavOffset(navItems, navList);

    let data = '';
    let peopleInterval = [];
    const changes = new Event('changes');

    getCalculatorData()
        .then(res => setData(res))
        .then(res => setPeopleInterval(res))
        .then(res => setErrorMessage(res));

    function getCalculatorData() {
        return fetch('https://autoverseny-csapatepites.hu/cars.json')
            .then(response => response.json())
    }

    function setData(fetchedData) {
        data = fetchedData;
        return new Promise((resolve) => {
            resolve(fetchedData);
        });
    }

    function setPeopleInterval(fetchedData) {
        peopleInterval = data.reduce((acc, curr) => {
            if (curr.cars[0].peopleMin <= acc[0]) {
                acc[0] = curr.cars[0].peopleMin;
            }
            if (curr.cars[curr.cars.length - 1].peopleMax >= acc[1]) {
                acc[1] = curr.cars[curr.cars.length - 1].peopleMax;
            }
            return acc;
        }, [1000000, 0]);
        return new Promise((resolve) => {
            resolve(peopleInterval);
        })
    }

    function setErrorMessage(peopleInterval) {
        document.getElementById('errorMessage').innerHTML =
            `A létszámnak ${peopleInterval[0]} és ${peopleInterval[1]} között kell lenni!`;
    }

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


