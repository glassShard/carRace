import {setMenuItems} from "./menuItems";
import {setDivs} from "./animationOnload";

let navHeight = 0;

const navList = [];

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

function scrollTo(element, to, duration) {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = (() => {
        currentTime += increment;

        element.scrollTop = Math.easeInOutQuad(currentTime, start, change, duration);

        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    });
     animateScroll();
}

Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};

function inputChanged(e, data, peopleInterval) {
    const inputValue = e.srcElement.value;

    const inputField = document.querySelector('.calcInput');

    if (inputValue < peopleInterval[0] || inputValue > peopleInterval[1]) {
        document.getElementById('chooseCar').innerHTML = null;
        setTimeout(() => {

            if (inputField.value < peopleInterval[0] || inputField.value > peopleInterval[1]) {
                document.getElementById('errorMessage').classList.remove('transparent');
                inputField.classList.remove('chosen');
            }
        }, 1000);
    } else {
        document.getElementById('errorMessage').classList.add('transparent');
        inputField.classList.add('chosen');
        const filteredCars = data.filter(elem => {
            return inputValue >= elem.cars[0].peopleMin &&
                inputValue <= elem.cars[elem.cars.length - 1].peopleMax;
        });
        const availableCarTypes = [];
        filteredCars.map(car => availableCarTypes.push(
            `<div class="calcChoosable carType">${car.name}</div>`));
        document.getElementById('chooseCar').innerHTML = null; //?
        document.getElementById('chooseCar').innerHTML = availableCarTypes.join('');
        const carTypes = Array.from(document.querySelectorAll('.carType'));
        carTypes.forEach(carType => carType.addEventListener('click', (e) => typeChanged(e, inputValue, data)));
    }
}

function typeChanged(e, inputValue, data) {
    Array.from(document.querySelectorAll('.carType')).map(elem => elem.classList.remove('chosen'));
    e.srcElement.classList.add('chosen');
    document.getElementById('choosePcs').innerHTML = null;
    const carName = e.srcElement.innerHTML;
    const car = data.filter((elem) => elem.name === carName)[0];
    const cars = [];
    car.cars.map(peopleNumGroup => {
        if (inputValue >= peopleNumGroup.peopleMin && inputValue <= peopleNumGroup.peopleMax) {
            cars.push(
                `<div class="calcChoosable carPcs">${peopleNumGroup.number}</div>`);
        }
    });
    document.getElementById('choosePcs').innerHTML = null; //?
    document.getElementById('choosePcs').innerHTML = cars.join('');
    const carPcs = Array.from(document.querySelectorAll('.carPcs'));
    carPcs.forEach(carType => carType.addEventListener('click', (e) => pcsChanged(e, inputValue, carName, data)));
}

function pcsChanged(e, inputValue, carName, data) {
    Array.from(document.querySelectorAll('.carPcs')).map(elem => elem.classList.remove('chosen'));
    e.srcElement.classList.add('chosen');
    const carPcs = + e.srcElement.innerHTML;
    const choosenCar = data.filter(elem => elem.name === carName)[0];
    const group = choosenCar.cars.filter(element => + element.number === carPcs)[0];
    const minPrice = group.priceMin;
    const minPeople = group.peopleMin;
    const step = choosenCar.priceStep;
    const price = (inputValue - minPeople) * step + minPrice;
    console.log(price);
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");

    navHeight = document.querySelector('nav').offsetHeight;

    document.body.style.paddingTop = navHeight + 'px';

    const navItems = document.querySelectorAll('.nav-link');
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

    let data = '';
    let peopleInterval = [];

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

    calcInput.addEventListener('input', (e) => inputChanged(e, data, peopleInterval));

    setMenuItems(navHeight, navList);
    setDivs();
    window.addEventListener('scroll', (e) => onScroll(navHeight, navList));
    navItems.forEach((navItem) => navItem.addEventListener('click', scroll));
});


