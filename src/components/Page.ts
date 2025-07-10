import { IPage } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Page extends Component<IPage> {
  catalogContainer: HTMLElement;
  basketButton: HTMLButtonElement;
  basketCounter: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.catalogContainer = ensureElement<HTMLElement>('.gallery');
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket');
    this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    })
  }

  set catalog(items: HTMLElement[]) {
    this.catalogContainer.replaceChildren(...items);
  }

  set counter(value: number) {
    this.setText(this.basketCounter, String(value));
  }
}