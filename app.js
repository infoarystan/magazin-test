const tg = window.Telegram.WebApp;
tg.expand();

// Твои товары. Цена в тенге (просто число)
const products = [
    { id: 1, name: "Шаурма с курицей", price: 1800, img: "https://infoarystan.github.io/magazin-test/shaurma.jpg" },
    { id: 2, name: "Хот дог с молосной сосиской", price: 1200, img: "https://infoarystan.github.io/magazin-test/hotdog.jpg" },
    { id: 3, name: "Фри", price: 450, img: "https://infoarystan.github.io/magazin-test/fri.jpg" }
    { id: 4, name: "Бургер с говяжей котлетой", price: 2000, img: "https://infoarystan.github.io/magazin-test/burger.jpg" }
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