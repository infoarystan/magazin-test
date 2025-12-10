const tg = window.Telegram.WebApp;
tg.expand();

// Твои товары (Ссылки взяты из твоего проекта)
const products = [
    { id: 1, name: "Шаурма", price: 1800, img: "https://infoarystan.github.io/magazin-test/shaurma.jpg" },
    { id: 2, name: "Хот-дог", price: 1200, img: "https://infoarystan.github.io/magazin-test/hotdog.jpg" },
    { id: 3, name: "Фри", price: 450, img: "https://infoarystan.github.io/magazin-test/fri.jpg" },
    { id: 4, name: "Бургер", price: 2000, img: "https://infoarystan.github.io/magazin-test/burger.jpg" }
];

let cart = {};

// Функция отрисовки (показывает товары на экране)
function render() {
    const list = document.getElementById('product-list');
    list.innerHTML = "";
    
    products.forEach(p => {
        const el = document.createElement('div');
        el.className = 'item';
        
        el.innerHTML = `
            <img src="${p.img}" style="width:100%; height:100px; object-fit:cover; border-radius:5px;">
            <h3>${p.name}</h3>
            <p>${p.price} ₸</p>
            <button onclick="addToCart(${p.id})" style="width:100%; padding:10px; background:#3390ec; color:white; border:none; border-radius:5px;">В корзину</button>
        `;
        
        list.appendChild(el);
    });
}

// Добавление в корзину
function addToCart(id) {
    if (!cart[id]) {
        cart[id] = 0;
    }
    cart[id]++;
    updateMainButton();
}

// Обновление главной кнопки (внизу)
function updateMainButton() {
    let total = 0;
    for (let id in cart) {
        let p = products.find(x => x.id == id);
        if (p) {
            total += p.price * cart[id];
        }
    }
    
    if (total > 0) {
        tg.MainButton.text = Оплатить ${total} ₸;
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// ОТПРАВКА ДАННЫХ (Самое важное)
Telegram.WebApp.onEvent('mainButtonClicked', function() {
    // Отправляем данные в n8n
    tg.sendData(JSON.stringify(cart));
});

// Запускаем магазин
render();