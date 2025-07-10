import { FormErrors, IBasketItem, IBasketState, IFormData, IOrder, IProduct } from '../types';
import { IEvents } from './base/events';

export class AppState {
	private catalog: IProduct[] = [];
	basket: IBasketItem[] = [];
	private preview: IProduct | null;
	order: IOrder = {
      payment: 'online',
      address: '',
      email: '',
      phone: '',
      total: 0,
      items: []
  };
  formErrors: FormErrors = {};

	constructor(protected events: IEvents) {}

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.events.emit('catalog:add', { catalog: this.catalog });
	}

	getCatalog(): IProduct[] {
		return this.catalog;
	}

	addToBasket(item: IProduct) {
    const basketItem = {
      id: item.id,
      title: item.title,
      price: item.price
    }

		this.basket.push(basketItem);
    this.saveBasketToStorage();
		this.events.emit('basket:changed', this.basket);
	}

	removeFromBasket(id: string) {
		this.basket = this.basket.filter(item => item.id !== id);
    this.saveBasketToStorage();
		this.events.emit('basket:changed', this.basket);
	}

	clearBasket() {
    this.basket = [];
    this.saveBasketToStorage();
		this.events.emit('basket:changed', this.basket);
  }

	getBasketTotal(): number {
    return this.basket.reduce((sum, item) => sum + item.price, 0)
  }

	getBasketCount(): number {
    return this.basket.length;
  }

	setPreview(item: IProduct) {
		this.preview = item;
		this.events.emit('preview:changed', item);
	}

	setOrderField(field: keyof IFormData, value: string) {
    if (field !== 'payment') {
      this.order[field] = value;
    } else if (value === 'online' || value === 'cash') {
      this.order.payment = value;
    }

    this.validateOrder();
  }

	validateOrder() {
    const errors: typeof this.formErrors = {};

    const emailReg = /^[\w.-]+@([\w-]+\.)+\w{2,}$/i;
    const phoneReg = /^(?:\+7|7|8)\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;

    if (!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты'
    }

    if (!this.order.address.trim()) {
      errors.address = 'Необходимо указать адрес доставки'
    }

    if (!this.order.email.trim()) {
      errors.email = 'Необходимо указать email';
    } else if (!emailReg.test(this.order.email.trim())) {
      errors.email = 'Неверный формат email';
    }

    if (!this.order.phone.trim()) {
      errors.phone = 'Необходимо указать телефон';
    } else if (!phoneReg.test(this.order.phone.trim())) {
      errors.phone = 'Неверный формат телефона';
    }
    
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
  }

  isInBasket(id: string) {
    return this.basket.some(item => item.id === id);
  }

  private saveBasketToStorage() {
    localStorage.setItem('basket', JSON.stringify(this.basket));
  }

  loadBasket() {
    try {
      const basketData = localStorage.getItem('basket');
      if (basketData) {
        const parsed = JSON.parse(basketData);
        if (Array.isArray(parsed)) {
          this.basket = parsed;
        }
      }
    } catch (e) {
      console.warn('Ошибка при загрузке корзины из localStorage:', e);
    }
  }
}
