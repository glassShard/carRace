export function sendEmail(event, from) {
    event.preventDefault();
    event.stopPropagation();
    let form;

    if (from === 'order') {
        form = document.querySelector('#orderForm');
    } else {
        form = document.querySelector('#messageForm');
    }

    if (form.checkValidity() === false) {
        form.classList.add('was-validated');
    } else {
        let datas = {};

        if (from === 'order') {
            document.querySelector('#sendOrder').setAttribute('disabled', 'disabled');
            const participants = document.querySelector('.calcInput').value;
            const type = Array.from(document.querySelectorAll('.carType'))
                .filter(type => type.classList.contains('chosen'))[0].innerHTML;
            const pieces = Array.from(document.querySelectorAll('.carPcs'))
                .filter(type => type.classList.contains('chosen'))[0].innerHTML;
            const price = document.querySelector('.finalPrice').innerHTML;
            const name = document.querySelector('#name').value;
            const email = document.querySelector('#email').value;

            const tel = document.querySelector('#tel').value;
            datas.content = {
                "participants": participants,
                "type": type,
                "pieces": pieces,
                "price": price,
                "name": name,
                "email": email,
                "tel": tel,
                "subject": 'Megrendelés'
            };
            datas.successMessage = 'Köszönjük megrendelésedet! Rövidesen felkeresünk a további' +
                ' részletek egyeztetése céljából.';
            datas.errorMessage = 'Megrendelésed továbbítása során hibák léptek fel. Kérjük,' +
                ' próbáld' +
                ' meg újra!';
            datas.querySelectors = {
                alert: '#sentOrderMessages',
                closeBtn: '#closeOrderModal',
                sendBtn: '#sendOrder'
            }
        } else {
            document.querySelector('#sendMessage').setAttribute('disabled', 'disabled');
            const message = document.querySelector('#message').value;
            const emailM = document.querySelector('#emailM').value;
            datas.content = {
                "emailM": emailM,
                "message": message,
                "subject": 'Üzenet'
            };
            datas.successMessage = 'Köszönjük üzenetedet! Igyekszünk mielőbb válaszolni.';
            datas.errorMessage = 'Üzeneted továbbítása során hibák léptek fel. Kérjük, próbáld' +
                ' meg újra!';
            datas.querySelectors = {
                alert: '#sentMessageMessages',
                closeBtn: '#closeMessageModal',
                sendBtn: '#sendMessage'
            }
        }
        postData(`https://teamsuccess.hu/sendOrderEmail.php`, datas.content)
            .then(data => {
                if (data.sent === null) {
                    document.querySelector(datas.querySelectors.alert).innerHTML = `
                        <div class="alert alert-success" role="alert">
                            ${datas.successMessage}
                        </div>`;
                    setTimeout(() => {
                        document.querySelector(datas.querySelectors.closeBtn).click();
                        document.querySelector(datas.querySelectors.alert).innerHTML = null;
                        document.querySelector(datas.querySelectors.sendBtn).disabled = false;
                    }, 3000);
                } else {
                    showError(datas.querySelectors.alert, datas.errorMessage, datas.querySelectors.sendBtn);
                }
            })
            .catch(error => showError(datas.querySelectors.alert, datas.errorMessage, datas.querySelectors.sendBtn));
    }
}

function showError(alertDiv, message, sendBtn) {
    document.querySelector(alertDiv).innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            <br />
            ${message}
        </div>`;
    document.querySelector(sendBtn).disabled = false;
}

function postData(url = ``, data = {}) {
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        // mode: "cors", // no-cors, cors, *same-origin
        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        // redirect: "follow", // manual, *follow, error
        // referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    }).then(response => response.json()); // parses response to JSON
}
