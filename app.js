const tg = window.Telegram.WebApp;
tg.expand();

// Твои товары. Цена в тенге (просто число)
const products = [
    { id: 1, name: "Донер Говяжий", price: 1800, img: "ССЫЛКА_НА_БУРГЕР" },
    { id: 2, name: "Фри Стандарт", price: 800, img: "ССЫЛКА_НА_ФРИ" },
    { id: 3, name: "Coca-Cola 0.5", price: 450, img: "ССЫЛКА_НА_КОЛУ" }
];

const list = document.getElementById('product-list');
let cart = {};

// Рисуем товары
products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>${p.price} ₸</p>
        <button onclick="add(${p.id})">В корзину</button>
    `;
    list.appendChild(div);
});

function add(id) {
    if (!cart[id]) cart[id] = 0;
    cart[id]++;
    updateBtn();
}

function updateBtn() {
    let total = 0;
    for (let id in cart) {
        let p = products.find(x => x.id == id);
        total += p.price * cart[id];
    }
    
    if (total > 0) {
        tg.MainButton.text = `Купить: ${total} ₸`;
        tg.MainButton.show();
    }
}

// Отправка данных боту
tg.MainButton.onClick(() => {
    let total = 0;
    // Считаем итог еще раз для надежности
    for (let id in cart) {
        let p = products.find(x => x.id == id);
        total += p.price * cart[id];
    }
    
    const data = {
        cart: cart,
        total: total
    };
    tg.sendData(JSON.stringify(data));
});