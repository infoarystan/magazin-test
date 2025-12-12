const tg = window.Telegram.WebApp;
tg.expand();

// Твоя ссылка на сервер
const API_URL = "https://breezy-lionfish-5.hooks.n8n.cloud/webhook/order"; 

const products = [
    { id: 1, name: "Шаурма", price: 1800, img: "https://infoarystan.github.io/magazin-test/shaurma.jpg" },
    { id: 2, name: "Хот-дог", price: 1200, img: "https://infoarystan.github.io/magazin-test/hotdog.jpg" },
    { id: 3, name: "Фри", price: 450, img: "https://infoarystan.github.io/magazin-test/fri.jpg" },
    { id: 4, name: "Бургер", price: 2000, img: "https://infoarystan.github.io/magazin-test/burger.jpg" }
];

let cart = {};

function render() {
    const list = document.getElementById('product-list');
    list.innerHTML = "";
    products.forEach(p => {
        const el = document.createElement('div');
        el.className = 'item';
        el.innerHTML = `
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p>${p.price} ₸</p>
            <button onclick="addToCart(${p.id})">В корзину</button>
        `;
        list.appendChild(el);
    });
}

function addToCart(id) {
    if (!cart[id]) cart[id] = 0;
    cart[id]++;
    updateMainButton();
}

function updateMainButton() {
    let total = 0;
    for (let id in cart) {
        let p = products.find(x => x.id == id);
        if (p) total += p.price * cart[id];
    }
    
    if (total > 0) {
        tg.MainButton.text = `Оплатить ${total} ₸`;
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// ПРОСТАЯ ФУНКЦИЯ ОТПРАВКИ
tg.MainButton.onClick(function() {
    tg.MainButton.showProgress();

    // Отправляем просто текст, чтобы браузер не ругался
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: JSON.stringify({
            cart: cart,
            user: tg.initDataUnsafe.user
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Ошибка сервера: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        // Если все хорошо
        tg.close();
        if (data.paymentLink) {
            tg.openLink(data.paymentLink);
        }
    })
    .catch(error => {
        // Если ошибка
        alert("Не удалось создать заказ. " + error.message);
        tg.MainButton.hideProgress();
    });
});

render();