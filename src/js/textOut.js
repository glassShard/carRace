const text = "Ez a legjobb weboldalkészítő alkalmazás";

const array = text.split('');
let print = [];

let count = 0;

const interval = setInterval(() => {
    print.push(array[count]);
    console.log(`${print.join('')}|`);
    count++;
    if (count >= array.length) clearInterval(interval);
}, 200);
