const tg = window.Telegram.WebApp;
tg.expand(); // Раскрываем приложение на весь экран

// ТВОИ ТОВАРЫ
const products = [
    { id: 1, name: "Шаурма", price: 1800, img: "https://infoarystan.github.io/magazin-test/shaurma.jpg" },
    { id: 2, name: "Хот-дог", price: 1200, img: "https://infoarystan.github.io/magazin-test/hotdog.jpg" },
    { id: 3, name: "Фри", price: 450, img: "https://infoarystan.github.io/magazin-test/fri.jpg" },
    { id: 4, name: "Бургер", price: 2000, img: "https://infoarystan.github.io/magazin-test/burger.jpg" }
];

let cart = {};

// Функция отрисовки товаров
function render() {
    const list = document.getElementById('product-list');
    list.innerHTML = ""; // Очищаем, чтобы не дублировалось
    
    products.forEach(p => {
        const el = document.createElement('div');
        el.className = 'item';
        el.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.price} ₸</p>
            <button class="btn" onclick="addToCart(${p.id})">В корзину</button>
        `;
        list.appendChild(el);
    });
}

// Функция добавления в корзину (сделали глобальной)
window.addToCart = function(id) {
    if (!cart[id]) cart[id] = 0;
    cart[id]++;
    updateBtn();
};

// Обновление Главной кнопки
function updateBtn() {
    let total = 0;
    for (let id in cart) {
        let p = products.find(x => x.id == id);
        if (p) {
            total += p.price * cart[id];
        }
    }

    if (total > 0) {
        // ВОТ ТУТ БЫЛА ОШИБКА. Добавил обратные кавычки ` `
        tg.MainButton.setText(`Купить: ${total} ₸`);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// Обработка клика по кнопке "Купить"
Telegram.WebApp.onEvent('mainButtonClicked', function(){
    // Считаем итог еще раз для отправки
    let total = 0;
    for (let id in cart) {
        let p = products.find(x => x.id == id);
        if (p) total += p.price * cart[id];
    }

    // Формируем данные: и корзина, и сумма
    const data = {
        cart: cart,
        total: total
    };
    
    // Отправляем данные боту (в n8n)
    tg.sendData(JSON.stringify(data)); 
});

// Запускаем отрисовку при старте
render();