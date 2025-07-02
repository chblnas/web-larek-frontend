# Проектная работа "Веб-ларек"
## Описание проекта
**Web-larёk** — интернет-магазин с каталогом, корзиной и оформлением заказа. Проект построен по паттерну MVP (Model-View-Presenter) и использует событийно-ориентированный подход.

## Стек:  
- `HTML`, `SCSS`, `TS`, `Webpack`

## 📂 Структура проекта:
-  `src/` — исходные файлы проекта
-  `src/components/` — папка с TS компонентами
-  `src/components/base/` — папка с базовым кодом  

## 📄 Важные файлы:
-  `src/pages/index.html` — HTML-файл главной страницы
-  `src/types/index.ts` — файл с типами
-  `src/index.ts` — точка входа приложения
-  `src/scss/styles.scss` — корневой файл стилей
-  `src/utils/constants.ts` — файл с константами
-  `src/utils/utils.ts` — файл с утилитами 

--- 

## 🚀 Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

--- 

## ⚙️ Сборка 

```
npm run build
```

или

```
yarn build
```

---

## 📑 Описание данных
### Типы данных
-  `IProduct` – данные продукта (id, title, description, category, image, price)
-  `IBasketItem` – данные продукта, лежащего в корзине (id, title, price, index)
-  `IBasketState` – состояние корзины (items, total)
-  `PaymentMethod` – способ оплаты ('online' | 'cash')
-  `IOrder` – данные заказа (payment, address, email, phone, total, items)
-  `IContactData` – контактные данные для заполнения формы (email, phone)
-  `IDeliveryData` – данные доставки для заполнения формы (payment, address)
-  `IOrderResult` – результат заказа (id, total)
-  `IPage` – данные для рендера основной страницы (catalog, counter)
-  `ICardActions` – обработчик нажатия на карточку
-  `IModalData` – данные модальных окон (content)
-  `IFormState` – данные валидности и ошибок формы (valid, errors)
-  `ISuccess` – данные для отображения успешного заказа (total)
- `ApiPostMethods` – тип строки, описывающий метод запроса ('POST' | 'PUT' | 'DELETE');

--- 

## 🗂️ Модель данных приложения (Слой Model)
### 🔹 Класс Api 
Базовый класс, для взаимодействия с сервером

**Поля**
-  `baseUrl: string` – ссылка на сервер
-  `options: RequestInit` – опции запроса 

**Конструктор**
-  `constructor(baseUrl: string, options?: RequestInit)` – конструктор, собирает базовый запрос к серверу, устанавливает url сервера и заголовки запроса

**Методы**
-  `handleResponse(response: Response): Promise<object>` – обрабатывает ответ сервера: если response.ok, возвращает данные, иначе — возвращает Promise.reject с ошибкой
-  `get(uri: string): Promise<Response>` – get-запрос к серверу для получения данных по переданному эндпоинту, возвращает промис с ответом от сервера
-  `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<Response>` – запрос к серверу на изменение/добавление/удаление данных по переданному эндпоинту, возвращает  промис с ответом от сервера (можно передать в качестве аргумента методы: POST, PUT, DELETE)

### 🔹 Класс AppState
Класс для взаимодействия со всеми данными в приложении

**Поля**
-  `catalog: IProduct[]` – массив товаров в каталоге
-  `basket: IBasketItem[]` – массив товаров в корзине
-  `preview: IProduct | null` – товар для предпросмотра
-  `order: IOrder | null` – данные для заказа 

**Методы**
-  `setCatalog(items: IProduct[]): void` – добавляет товары в каталог
-  `getCatalog(): IProduct[]` – возвращает каталог товаров
-  `addToBasket(id: string): void` – добавляет товар по идентификатору в корзину
-  `removeFromBasket(id: string): void` – удаляет товар по идентификатору из корзины
-  `clearBasket(): void` – очищает корзину
-  `getBasketTotal(): number` – возвращает сумму товаров в корзине
-  `getBasketCount(): number` – возвращает количество товаров в корзине
-  `setPreview(item: IProduct): void` – добавляет товар в предпросмотр
-  `setOrderField(field: keyof IOrder, value: unknown): void` – устанавливает значение поля заказа
-  `validateOrder(): boolean` – проверяет валидность данных для заказа

### 🔹 Класс AppApi наследуется от Api
Расширение базового класса Api с методами для товаров

**Поля**
-  `cdn: string` – url сервера фотографий

**Конструктор**
-  `constructor(cdn: string, baseUrl: string, options?: RequestInit)` – устанавливает значение cdn соответствующему свойству в классе, устанавливает ссылку на сервер с товарами

**Методы**
-  `getProductItem(id: string): Promise<IProduct>` – получает товар с сервера и возвращает промис с данными товара
-  `getProductList(): Promise<IProduct[]>` – получает список товаров с сервера и возвращает промис с массивом товаров
-  `orderProducts(order: IOrder): Promise<IOrderResult>` – отправляет post-запрос на сервер с данными заказа и возвращает промис с идентификатором заказа и суммой покупки 

---  

## 🖼️ Компоненты представления (Слой View)
### 🔹 Класс Component<T> 
Базовый класс, который является родителем для классов отображения

**Конструктор**
-  `constructor(container: HTMLElement)` – конструктор для получения контейнера

**Методы**
-  `toggleClass(element: HTMLElement, className: string, force?: boolean): void` – переключает класс
-  `setText(element: HTMLElement, value: unknown): void` – устанавливает текстовое содержимое элементу
-  `setDisabled(element: HTMLElement, state: boolean): void` – меняет состояние блокировки элемента
-  `setHidden(element: HTMLElement): void` – скрывает элемент
-  `setVisible(element: HTMLElement): void` – показывает элемент
-  `setImage(element: HTMLImageElement, src: string, alt?: string): void` – устанавливает изображение с альтернативным текстом
-  `render(data?: Partial<T>): HTMLElement` – обновляет содержимое и возвращает контейнер 

### 🔹 Класс Page наследуется от Component<IPage> 
Отвечает за отображение основной страницы

**Поля**
-  `catalogContainer: HTMLElement` – контейнер для каталога товаров (".gallery")
-  `basketButton: HTMLButtonElement` – кнопка корзины (".header__basket")
-  `basketCounter: HTMLElement` – счетчик товаров в корзине (".header__basket-counter") 

**Конструктор**
-  `constructor(container: HTMLElement, events: IEvents)` – конструктор устанавливает HTML элементы и добавляет обработчик на клик по корзине товаров  

**Методы**
-  `set catalog(items: HTMLElement[]): void` – сеттер для установки массива товаров в каталог
-  `set counter(value: number): void` – сеттер для установки значения количества товаров в корзине 

### 🔹 Класс Card наследуется от Component<IProduct> 
Базовый класс, отвечает за создание карточек товаров

**Поля**
-  `_title: HTMLElement` – поле с названием товара (".card__title")
-  `_price: HTMLElement` – поле с ценой товара (".card__price")
-  `_button?: HTMLButtonElement | null` – кнопка товара (добавить в корзину, удалить из корзины) (".card__button")
-  `_category?: HTMLElement | null` – поле с категорией товара (".card__category")
-  `_image?: HTMLImageElement | null` – изображение товара  (".card__image")

**Конструктор**
-  `constructor(container: HTMLElement, actions?: ICardActions)` – конструктор для установления базовой разметки карточек, если есть обработчик, то навесит его на кнопку, если это карточка в каталоге, то навесит обработчик на клик по самой карточке

**Методы**
-  `set id(value: string)` – сеттер для установки идентификатора товара
-  `set title(value: string)` – сеттер для установки названия товара
-  `set description(value: string)` – сеттер для установки описания товара
-  `set category(value: string)` – сеттер для установки категории товара
-  `set image(value: string)` – сеттер для установки изображения товара
-  `set price(value: number | null)` – сеттер для установки цены товара

### 🔹 CatalogCard наследуется от Card
Отвечает за отображение карточки в каталоге

**Конструктор**
-  `constructor(container: HTMLElement, actions?: ICardActions)` – конструктор карточки в каталоге

### 🔹 PreviewCard наследуется от Card
Отвечает за отображение карточки в предпросмотре

**Поля**
-  `_description: HTMLElement` – поле с описанием товара (".card__text")
  

**Конструктор**
-  `constructor(container: HTMLElement, actions?: ICardActions)` – конструктор предпросмотра карточки

### 🔹 BasketCard наследуется от Card
Отвечает за отображение карточки в корзине

**Поля**
-  `_index: number` – индекс элемента для отображения позиции в корзине

**Конструктор**
-  `constructor(container: HTMLElement, actions?: ICardActions)` – конструктор карточки в корзине

### 🔹 Класс Modal наследуется от Component<IModalData>
Универсальный класс для отображения модальных окон

**Поля**
-  `closeButton: HTMLButtonElement` – кнопка закрытия модального окна

**Конструктор**
-  `constructor(container: HTMLElement)` – устанавливает контейнер для содержимого модального окна, устанавливает кнопку закрытия, добавляет обработчики на клики по кнопке закрытия, клику вне модального окна и по нажатию клавиши "Esc"

**Методы**
-  `open(): void` – открытие модального окна
-  `close(): void` – закрытие модального окна и очистка контента
-  `render(data: IModalData): HTMLElement` – отображение модального окна на странице с контентом, который передан в качестве аргумента

### 🔹 Класс Basket наследуется от Component<IBasketState>
Отображает корзину с товарами

**Поля**
-  `itemsContainer: HTMLElement` – контейнер для товаров в корзине
-  `orderButton: HTMLButtonElement` – кнопка оформления заказа
-  `basketPrice: HTMLElement` – итоговая стоимость товаров в корзине

**Конструктор**
-  `constructor(container: HTMLElement)` – инициализирует элементы, устанавливает обработчик на кнопку оформления заказа

**Методы**
-  `set items(items: HTMLElement[])` – сеттер для установки товаров в корзине
-  `set total(total: number)` – сеттер для установки итоговой суммы товаров

### 🔹 Класс Form<T> наследуется от Component<IFormState>
Базовый класс формы

**Поля**
-  `submitButton: HTMLButtonElement` – кнопка подтверждения
-  `errorsElement: HTMLElement` – ошибки валидации

**Конструктор**
-  `constructor(container: HTMLFormElement, events: IEvents)` – инициализирует элементы, добавляет обработчики на ввод значений и отправку формы
  
**Методы**
-  `set valid(valid: boolean)` – сеттер для установки валидности формы
-  `set errors(value: string)` – сеттер для установки сообщений ошибок формы
-  `render(state: Partial<T> & IFormState)` – принимает объект с данными о валидности, ошибках и значениях формы и возвращает контейнер с формой

### 🔹 Класс DeliveryForm наследуется от Form<IDeliveryData>
Отвечает за отображение формы доставки

**Конструктор**
-  `constructor(container: HTMLFormElement, events: IEvents)` – вызывает конструктор родителя

**Методы**
-  `set payment(value: PaymentMethod)` – сеттер для установки способа оплаты
-  `set address(value: string)` – сеттер для установки адреса доставки

### 🔹 Класс ContactForm наследуется от Form<IContactData>
Отвечает за отображение формы контактных данных

**Конструктор**
-  `constructor(container: HTMLFormElement, events: IEvents)` – вызывает конструктор родителя

**Методы**
-  `set phone(value: string)` – сеттер для установки номера телефона
-  `set email(value: string)` – сеттер для установки электронной почты 

### 🔹 Класс Success наследуется от Component<ISuccess> 
Для отображения уведомления об успешном оформлении заказа

**Поля**
-  `totalElement: HTMLElement` – элемент с итоговой суммой заказа
-  `buttonClose: HTMLButtonElement` – кнопка закрытия

**Конструктор**
-  `constructor(container: HTMLElement)` – инициализирует элементы и добавляет обработчик на нажатие кнопки закрытия

---

## 🎛️ Слой Presenter
Слой реализован в файле `src/index.ts` с использованием событийно-ориентированного подхода

### 🔹 Класс EventEmitter – брокер событий
Классический брокер событий для установления и обработки событий

**Поля**
-  `_events: Map<EventName, Set<Subscriber>>` – коллекция событий

**Методы**
-  `on<T extends object>(eventName: EventName, callback: (event: T) => void)` – установить обработчик на событие
-  `off(eventName: EventName, callback: Subscriber)` – снять обработчик с события
-  `emit<T extends object>(eventName: string, data?: T)` – записать событие в коллекцию 

## 📢 События:

### Генерируемые моделью
-  `catalog:add` – товары загружены в каталог
-  `basket:changed` – содержимое корзины изменено
-  `order:success` – заказ оформлен 

### Генерируемые представлением
-  `card:select` – выбрана карточка товара
-  `basket:add` – товар добавлен в корзину
-  `basket:remove` – товар удален из корзины
-  `basket:open` – открыта корзина с товарами
-  `order:submit` – нажата кнопка отправки заказа