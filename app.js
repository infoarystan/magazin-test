const tg = window.Telegram.WebApp;
tg.expand();

// ТВОИ ТОВАРЫ
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
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.price} ₸</p>
            <button onclick="add(${p.id})">В корзину</button>
        `;
        list.appendChild(el);
    });
}

function add(id) {
    if (!cart[id]) cart[id] = 0;
    cart[id]++;
    updateBtn();
}

function updateBtn() {
    let total = 0;
    for (let id in cart) {
        let p = products.find(x => x.id == id);
        if (p) {
            // ВОТ ТУТ БЫЛА ОШИБКА, ТЕПЕРЬ ИСПРАВЛЕНО:
            total += p.price * cart[id];
        }
    }
    if (total > 0) {
        tg.MainButton.text = Купить на ${total} ₸;
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// ГЛАВНОЕ СОБЫТИЕ
Telegram.WebApp.onEvent('mainButtonClicked', function(){
    // Маячок для проверки
    alert("Данные отправляются..."); 
    
    // Отправка данных
    tg.sendData(JSON.stringify(cart)); 
});

render();