import { AppApi } from './components/AppApi';
import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { BasketCard, CatalogCard, PreviewCard } from './components/Card';
import { ContactForm, DeliveryForm } from './components/Form';
import { Modal } from './components/Modal';
import { Page } from './components/Page';
import { Success } from './components/Success';
import './scss/styles.scss';
import { IContactData, IDeliveryData, IFormData, IOrder, IProduct, PaymentMethod } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement, isEmpty } from './utils/utils';

const api = new AppApi(CDN_URL, API_URL);
const events = new EventEmitter();

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appState = new AppState(events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new DeliveryForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactForm(cloneTemplate(contactTemplate), events);


// Загружен каталог товаров
events.on('catalog:add', () => {
	page.catalog = appState.getCatalog().map(item => {
		const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item)
		});
		return card.render({
			title: item.title,
			price: item.price,
			category: item.category,
			image: item.image
		})
	})

	page.counter = appState.getBasketCount();
});

// Выбрана карточка
events.on('card:select', (item: IProduct) => {
	appState.setPreview(item);
});

// Изменился открытый предпросмотр карточки
events.on('preview:changed', (item: IProduct) => {
	const showCard = (item: IProduct) => {
		const card = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if(item.price === null) return // Если товар бесценный, то не добавляем его в корзину

				if (appState.isInBasket(item.id)) {
					appState.removeFromBasket(item.id);
				} else {
					appState.addToBasket(item);
				}

				// После изменения корзины меняем текст кнопки
				card.buttonText = appState.isInBasket(item.id) ? 'Убрать из корзины' : 'В корзину';
			}
		});

		// Установить начальное состояние текста кнопки
  	card.buttonText = appState.isInBasket(item.id) ? 'Убрать из корзины' : 'В корзину';

		card.setButtonDisabled(item.price === null);

		modal.render({
			content: card.render({
				title: item.title,
				price: item.price,
				description: item.description,
				category: item.category,
				image: item.image,
			})
		})
	}

	if (item) {
		api.getProductItem(item.id)
			.then(res => showCard(res))
			.catch(err => console.error(err))
	}
});

// Изменилось состояние корзины
events.on('basket:changed', () => {
	page.counter = appState.getBasketCount();
	basket.total = appState.getBasketTotal();

	// Если корзина открыта, то перерисовываем ее
	if (basket.isOpen) {
		events.emit('basket:open');
	}
});

// Корзина открыта
events.on('basket:open', () => {
	basket.open(); // Устанавливаем флаг открытой корзины
	basket.setButtonDisabled(appState.getBasketCount() === 0);

	basket.items = appState.basket.map((item, index) => {
		const card = new BasketCard(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appState.removeFromBasket(item.id);
			}
		});

		card.index = index + 1;

		return card.render({
			title: item.title,
			price: item.price
		})
	});

	modal.render({
		content: basket.render()
	})
});

// Открытие формы со способом оплаты и адресом доставки
events.on('order:open', () => {
	appState.order.items = appState.basket.map(item => item.id);
	appState.order.total = appState.getBasketTotal();

	modal.render({
		content: order.render({
				payment: 'online',
				address: '',
				valid: false,
				errors: []
		})
	});
});

// Установка способа оплаты
events.on('order.payment:set', (data: {method: PaymentMethod}) => {
	appState.setOrderField('payment', data.method);
	order.payment = data.method;
});

events.on(/^order\..*:change/, (data: { field: keyof IDeliveryData, value: string }) => {
    appState.setOrderField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IContactData, value: string }) => {
    appState.setOrderField(data.field, data.value);
});

events.on('formErrors:change', (errors: Partial<IFormData>) => {
  // Определяем — формы валидны или нет
  const orderValid = !errors.payment && !errors.address;
  const contactValid = !errors.email && !errors.phone;

  // Проставляем состояние кнопки
  order.valid = orderValid;
  contacts.valid = contactValid;

  // Собираем ошибки для каждой формы
  const orderErrors: string[] = [];
  if (errors.payment) orderErrors.push(errors.payment);
  if (errors.address) orderErrors.push(errors.address);

  const contactErrors: string[] = [];
  if (errors.email) contactErrors.push(errors.email);
  if (errors.phone) contactErrors.push(errors.phone);

  // Вывод ошибок
  order.errors = orderErrors.join(', ');
  contacts.errors = contactErrors.join(', ');
});

// Отправка формы способа оплаты и адреса
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: []
		})
	});
});

// Отправка формы контактных данных
events.on('contacts:submit', () => {
	api.orderProducts(appState.order)
		.then(result => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				}
			});

			success.total = result.total;
			appState.clearBasket();

			modal.render({
				content: success.render({})
			});
		})
		.catch(err => console.error(err));

});

api.getProductList()
	.then(appState.setCatalog.bind(appState))
	.catch(err => console.error(err));

// Закрытие модального окна
events.on('modal:close', () => {
	basket.close(); // Устанавливаем флаг закрытой корзины
});