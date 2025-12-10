const tg = window.Telegram.WebApp;
tg.expand();

// ТВОИ ТОВАРЫ
// Внимательно: после каждой фигурной скобки } стоит запятая ,
const products = [
    {
        id: 1,
        name: "Шаурма",
        price: 1800,
        img: "https://infoarystan.github.io/magazin-test/shaurma.jpg"
    },
    {
        id: 2,
        name: "Хот-дог",
        price: 1200,
        img: "https://infoarystan.github.io/magazin-test/hotdog.jpg"
    },
    {
        id: 3,
        name: "Фри",
        price: 450,
        img: "https://infoarystan.github.io/magazin-test/fri.jpg"
    },
    {
        id: 4,
        name: "Бургер",
        price: 2000,
        img: "https://infoarystan.github.io/magazin-test/burger.jpg"
    }
];

let cart = {};

function render() {
    const list = document.getElementById('product-list');
    list.innerHTML = "";
    
    products.forEach(p => {
        const el = document.createElement('div');
        el.className = 'item';
        
        // Создаем картинку
        const img = document.createElement('img');
        img.src = p.img;
        
        // Создаем название
        const h3 = document.createElement('h3');
        h3.innerText = p.name;
        
        // Создаем цену
        const price = document.createElement('p');
        price.innerText = p.price + " ₸";
        
        // Создаем кнопку
        const btn = document.createElement('button');
        btn.innerText = "В корзину";
        btn.onclick = function() {
            add(p.id);
        };
        
        // Собираем всё вместе
        el.appendChild(img);
        el.appendChild(h3);
        el.appendChild(price);
        el.appendChild(btn);
        
        list.appendChild(el);
    });
}

function add(id) {
    if (!cart[id]) {
        cart[id] = 0;
    }
    cart[id]++;
    updateBtn();
}

function updateBtn() {
    let total = 0;
    for (let id in cart) {
        let p = products.find(function(x) { return x.id == id; });
        if (p) {
            total += p.price * cart[id];
        }
    }
    
    if (total > 0) {
        tg.MainButton.text = "Купить на " + total + " ₸";
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

Telegram.WebApp.onEvent('mainButtonClicked', function(){
    tg.sendData(JSON.stringify(cart));
});

render();