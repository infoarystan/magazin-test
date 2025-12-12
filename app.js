const tg = window.Telegram.WebApp;
tg.expand();

// АДРЕС ТВОЕГО N8N (Сюда вставим Webhook URL позже)
// Пока поставь заглушку или адрес туннеля, если есть
const API_URL = "https://donerking-new.hooks.n8n.cloud/"; 

// Товары (Позже сделаем подгрузку из Airtable, пока оставим так для теста)
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

// НОВАЯ ЛОГИКА ОТПРАВКИ
tg.MainButton.onClick(async function() {
    tg.MainButton.showProgress(); // Показываем крутилку загрузки

    // Формируем данные заказа
    const payload = {
        cart: cart,
        initData: tg.initData, // !ВАЖНО: Данные для проверки безопасности
        user: tg.initDataUnsafe.user
    };

    try {
        // Отправляем запрос в n8n
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status === 'success' && result.paymentLink) {
            // Если все ок, открываем ссылку на оплату
            tg.close(); // Закрываем мини-апп (или можно redirect)
            tg.openLink(result.paymentLink); // Открываем платежку
        } else {
            alert('Ошибка создания заказа: ' + (result.message || 'Unknown error'));
        }
    } catch (error) {
        alert('Ошибка связи с сервером. Попробуйте позже.');
        console.error(error);
    } finally {
        tg.MainButton.hideProgress();
    }
});

render();
// ... (начало файла то же самое)

tg.MainButton.onClick(async function() {
    tg.MainButton.showProgress();

    const payload = {
        cart: cart,
        initData: tg.initData, 
        user: tg.initDataUnsafe.user
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // Добавляем заголовки, чтобы браузер не ругался
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Если сервер ответил ошибкой (например 404 или 500)
        if (!response.ok) {
            throw new Error(`Сервер ответил: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.status === 'success') {
            tg.close();
            if (result.paymentLink) tg.openLink(result.paymentLink);
        } else {
            alert('Ошибка заказа: ' + JSON.stringify(result));
        }
    } catch (error) {
        // ТЕПЕРЬ ОН ПОКАЖЕТ РЕАЛЬНУЮ ПРИЧИНУ
        alert('Критическая ошибка: ' + error.message);
    } finally {
        tg.MainButton.hideProgress();
    }
});