import { scrollTo } from "./scrollTo";


export function inputChanged(e, data, peopleInterval, changes) {
    const inputValue = e.srcElement.value;

    const inputField = document.querySelector('.calcInput');
    const chooseCarDiv = document.getElementById('chooseCar');
    const choosePcsDiv = document.getElementById('choosePcs');
    const typeDiv = document.querySelector('.types');
    const pieceDiv = document.querySelector('.pieces');
    const priceDiv = document.querySelector('.price');
    const section = document.querySelector('#arajanlat');
    const orderDiv = document.querySelector('.order');

    peopleChanged(data, peopleInterval);

    function peopleChanged(data, peopleInterval) {

        if (inputValue < peopleInterval[0] || inputValue > peopleInterval[1]) {
            chooseCarDiv.innerHTML = null;
            choosePcsDiv.innerHTML = null; //?
            orderDiv.innerHTML = null;
            pieceDiv.style.cssText = 'max-height: 0';
            typeDiv.style.cssText = 'max-height: 0';
            priceDiv.style.cssText = 'max-height: 0';
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
            chooseCarDiv.innerHTML = null; //?
            typeDiv.addEventListener('transitionend', (e) => scrollToWindow(e, section));
            typeDiv.style.cssText = 'max-height: 1000px';
            chooseCarDiv.innerHTML = availableCarTypes.join('');
            const carTypes = Array.from(document.querySelectorAll('.carType'));
            carTypes.forEach(carType => carType.addEventListener('click', (e) => typeChanged(e, inputValue, data)));
            if (availableCarTypes.length === 1) {
                document.querySelector('.carType').click();
            }
        }
    }

    function typeChanged(e, inputValue, data) {
        Array.from(document.querySelectorAll('.carType')).map(elem => elem.classList.remove('chosen'));
        e.srcElement.classList.add('chosen');
        choosePcsDiv.innerHTML = null;
        orderDiv.innerHTML = null;
        priceDiv.style.maxHeight = 0;
        // document.querySelector('.finalPrice').innerHTML = null;
        const carName = e.srcElement.innerHTML;
        const car = data.filter((elem) => elem.name === carName)[0];
        const cars = [];
        car.cars.map(peopleNumGroup => {
            if (inputValue >= peopleNumGroup.peopleMin && inputValue <= peopleNumGroup.peopleMax) {
                cars.push(
                    `<div class="calcChoosable carPcs">${peopleNumGroup.number}</div>`);
            }
        });
        choosePcsDiv.innerHTML = null; //?
        choosePcsDiv.innerHTML = cars.join('');
        pieceDiv.addEventListener('transitionend', (e) => scrollToWindow(e, section));
        pieceDiv.style.cssText = 'max-height: 1000px';
        const carPcs = Array.from(document.querySelectorAll('.carPcs'));
        carPcs.forEach(carType => carType.addEventListener('click', (e) => pcsChanged(e, inputValue, carName, data)));
        if (cars.length === 1) {
            document.querySelector('.carPcs').click();
        }
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
        const people = document.querySelector('.calcInput').value;
        document.querySelector('.finalPrice').innerHTML = `${Math.round(price * 10 / people) * 100} Ft / fő`;
        document.querySelector('.order').innerHTML = `
            <hr />
            <div class="price text-center">
                <p class="big-font text">Mit tartalmaz ez az ár
                    <span><button class="btn-primary btn-info" data-toggle="modal"
                                  data-target="#priceIncludes">?</button></span>
                </p>
            </div>
            <button class="btn btn-primary btn-lg btn-order" id="orderButton" data-toggle="modal"
                              data-target="#orderModal">
                Megrendelem ezt a programot...
            </button>`;
        priceDiv.addEventListener('transitionend', (e) => scrollToWindow(e, section));
        priceDiv.style.cssText = 'max-height: 1000px';
    }

    function scrollToWindow(e, element) {

        if (!(e.propertyName === "max-height")) {
            return
        }

        // needed because the navbar active states has to be adjusted to the changing height of
        // section
        section.dispatchEvent(changes);

        const elementBottom = element.offsetTop + element.offsetHeight;

        if (window.scrollY + window.innerHeight < elementBottom) {
            scrollTo(document.documentElement, elementBottom - window.innerHeight, 200);
        }
    }
}





