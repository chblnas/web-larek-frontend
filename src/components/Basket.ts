import { IBasketState } from "../types";
import { ensureElement, createElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Basket extends Component<IBasketState> {
  itemsContainer: HTMLElement;
  orderButton: HTMLButtonElement;
  basketPrice: HTMLElement;
  private _isOpen: boolean = false;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.itemsContainer = ensureElement<HTMLElement>('.basket__list', container);
    this.orderButton = ensureElement<HTMLButtonElement>('.button', container);
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', container);
  
    if (this.orderButton) {
      this.orderButton.addEventListener('click', () => {
          events.emit('order:open');
      });
    }
  }

  get isOpen() {
    return this._isOpen;
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.itemsContainer.replaceChildren(...items);
    } else {
      this.itemsContainer.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'В корзине ничего нет'
      }));
    }
  }

  set total(total: number) {
    this.setText(this.basketPrice, `${total} синапсов`)
  }

  open() {
    this._isOpen = true;
  }

  close() {
    this._isOpen = false;
  }

  setButtonDisabled(state: boolean) {
    if (this.orderButton) {
      this.setDisabled(this.orderButton, state);
    }
  }
}
