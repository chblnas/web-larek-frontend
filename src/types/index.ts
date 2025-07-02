/** Товар */
interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
}

/** Товар в корзине */
// type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'> & {
//   index: number;
// }

/** Состояние корзины */
interface IBasketView {
  items: HTMLElement[];
  total: number;
}

/** Способ оплаты */
type PaymentMethod = 'online' | 'cash';

/** Заказ */
interface IOrder {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
}

/** Контактные данные */
interface IContactData {
  email: string;
  phone: string;
}

interface IDeliveryData {
  payment: PaymentMethod;
  address: string;
}

/** Результат заказа */
interface IOrderResult {
  id: string;
  total: number;
}

interface IPage {
  catalog: HTMLElement[];
  counter: number;
}

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

interface IModalData {
  content: HTMLElement;
}

interface IFormState {
  valid: boolean;
  errors: string[];
}

interface ISuccess {
  total: number;
}