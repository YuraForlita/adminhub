// Приклад даних для демо-режиму (коли Firebase ще не підключено).
// Цей самий формат приймає «Імпорт JSON» на сторінці «Доступи та дані».
const L = (id, title, url, desc = '', tags = []) => ({ id, title, url, desc, tags });

export const DEMO_SITES = [
  {
    id: 'demo-shop', name: 'Демо-магазин', url: 'https://shop.example.com', adminUrl: 'https://shop.example.com/admin/',
    color: '#4f46e5', order: 1, note: 'OpenCart 3. Після змін у товарах — очистити кеш (Панель → шестерня).',
    sections: [
      { id: 'product', icon: '🛍️', title: 'Сторінка товару', note: 'Усе, що бачить покупець на картці товару', links: [
        L('p1', 'Список товарів (пошук за назвою / артикулом)', 'https://shop.example.com/admin/index.php?route=catalog/product', 'Фільтр зверху праворуч → назва або модель → олівець', ['товар', 'картка', 'артикул']),
        L('p2', 'Ціна, акційна ціна, знижки', 'https://shop.example.com/admin/index.php?route=catalog/product', 'Товар → вкладки «Дані» (ціна) та «Акції»', ['ціна', 'вартість', 'акція', 'знижка']),
        L('p3', 'Фото товару', 'https://shop.example.com/admin/index.php?route=catalog/product', 'Товар → вкладка «Зображення»', ['фото', 'картинка', 'галерея']),
        L('p4', 'Характеристики (атрибути)', 'https://shop.example.com/admin/index.php?route=catalog/attribute', 'Довідник атрибутів. Значення — у товарі, вкладка «Атрибути»', ['характеристики', 'атрибути']),
        L('p5', 'Опції: колір, розмір', 'https://shop.example.com/admin/index.php?route=catalog/option', '', ['колір', 'розмір', 'варіанти']),
        L('p6', 'Бренди / виробники', 'https://shop.example.com/admin/index.php?route=catalog/manufacturer', '', ['бренд', 'виробник']),
        L('p7', 'Відгуки', 'https://shop.example.com/admin/index.php?route=catalog/review', 'Нові відгуки потрібно увімкнути (статус)', ['відгуки', 'коментарі']),
      ] },
      { id: 'home', icon: '🏠', title: 'Головна сторінка', links: [
        L('h1', 'Банери та слайдер', 'https://shop.example.com/admin/index.php?route=design/banner', '', ['банер', 'слайдер', 'акція']),
        L('h2', 'Блоки головної (модулі)', 'https://shop.example.com/admin/index.php?route=design/layout', 'Схема «Home»', ['модулі', 'блоки', 'хіти']),
        L('h3', 'Меню категорій', 'https://shop.example.com/admin/index.php?route=catalog/category', '', ['меню', 'навігація']),
      ] },
      { id: 'cat', icon: '🗂️', title: 'Категорії та фільтри', links: [
        L('c1', 'Категорії', 'https://shop.example.com/admin/index.php?route=catalog/category', 'Назва, опис, SEO-текст категорії', ['категорія', 'каталог']),
        L('c2', 'Фільтри', 'https://shop.example.com/admin/index.php?route=catalog/filter', '', ['фільтр']),
      ] },
      { id: 'orders', icon: '📦', title: 'Замовлення', links: [
        L('o1', 'Усі замовлення', 'https://shop.example.com/admin/index.php?route=sale/order', '', ['замовлення', 'статус']),
        L('o2', 'Повернення', 'https://shop.example.com/admin/index.php?route=sale/returns', '', ['повернення']),
        L('o3', 'Промокоди / купони', 'https://shop.example.com/admin/index.php?route=marketing/coupon', '', ['промокод', 'купон', 'знижка']),
      ] },
      { id: 'ship', icon: '🚚', title: 'Доставка та оплата', links: [
        L('s1', 'Способи доставки', 'https://shop.example.com/admin/index.php?route=marketplace/extension&type=shipping', '', ['доставка', 'нова пошта']),
        L('s2', 'Способи оплати', 'https://shop.example.com/admin/index.php?route=marketplace/extension&type=payment', '', ['оплата', 'liqpay', 'monobank']),
      ] },
      { id: 'seo', icon: '🔍', title: 'SEO', links: [
        L('seo1', 'SEO URL (ЧПУ)', 'https://shop.example.com/admin/index.php?route=design/seo_url', '', ['url', 'чпу', 'адреса']),
        L('seo2', 'Meta title / description магазину', 'https://shop.example.com/admin/index.php?route=setting/setting', 'Вкладка «Загальне»', ['meta', 'title', 'description']),
      ] },
      { id: 'pages', icon: '📄', title: 'Інформаційні сторінки', links: [
        L('i1', 'Про нас, Оплата і доставка, Контакти', 'https://shop.example.com/admin/index.php?route=catalog/information', '', ['сторінки', 'контакти', 'про нас']),
        L('i2', 'Телефон, адреса, графік роботи', 'https://shop.example.com/admin/index.php?route=setting/setting', 'Вкладка «Магазин»', ['телефон', 'адреса', 'графік']),
      ] },
    ],
  },
  {
    id: 'demo-blog', name: 'Демо-блог', url: 'https://blog.example.com', adminUrl: 'https://blog.example.com/wp-admin/',
    color: '#10b981', order: 2, note: 'WordPress + Yoast SEO',
    sections: [
      { id: 'posts', icon: '✍️', title: 'Статті', links: [
        L('b1', 'Усі статті', 'https://blog.example.com/wp-admin/edit.php', '', ['статті', 'пости', 'записи']),
        L('b2', 'Нова стаття', 'https://blog.example.com/wp-admin/post-new.php', '', ['додати', 'написати']),
        L('b3', 'Рубрики', 'https://blog.example.com/wp-admin/edit-tags.php?taxonomy=category', '', ['категорії', 'рубрики']),
      ] },
      { id: 'design', icon: '🎨', title: 'Вигляд', links: [
        L('d1', 'Меню', 'https://blog.example.com/wp-admin/nav-menus.php', '', ['меню']),
        L('d2', 'Віджети (сайдбар, футер)', 'https://blog.example.com/wp-admin/widgets.php', '', ['футер', 'сайдбар', 'віджет']),
      ] },
      { id: 'seo', icon: '🔍', title: 'SEO', links: [
        L('y1', 'Yoast — загальні налаштування', 'https://blog.example.com/wp-admin/admin.php?page=wpseo_dashboard', '', ['seo', 'yoast', 'meta']),
      ] },
    ],
  },
];
