/** Товар */
export interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
}

/** Товар в корзине */
export type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>

/** Состояние корзины */
export interface IBasketState {
  items: HTMLElement[];
  total: number;
}

/** Способ оплаты */
export type PaymentMethod = 'online' | 'cash';

/** Заказ */
export interface IOrder {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
}

/** Контактные данные */
export type IFormData = IDeliveryData & IContactData;

export interface IDeliveryData {
  payment: PaymentMethod;
  address: string;
}

export interface IContactData {
  email: string;
  phone: string;
}

/** Результат заказа */
export interface IOrderResult {
  id: string;
  total: number;
}

export interface IPage {
  catalog: HTMLElement[];
  counter: number;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface IModalData {
  content: HTMLElement;
}

export interface IFormState {
  valid: boolean;
  errors: string[];
}

export interface ISuccess {
  total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
