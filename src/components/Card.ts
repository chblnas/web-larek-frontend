import { ICardActions, IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement | null;
  protected _category?: HTMLElement | null;
  protected _image?: HTMLImageElement | null;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._button = container.querySelector('.card__button');
    this._category = container.querySelector('.card__category');
    this._image = container.querySelector('.card__image');

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set category(value: string) {
    this.setText(this._category, value);
    this._category.className = `card__category card__category_${this.getCategoryClass(value)}`;
  }

  set image(value: string) {
    this.setImage(this._image, value);
  }

  set price(value: number | null) {
    if (value) {
      this.setText(this._price, `${value} синапсов`);
    } else {
      this.setText(this._price, 'Бесценно');
    }
  }

  private getCategoryClass(value: string) {
    const categories: Record<string, string> = {
      'софт-скил': 'soft',
			'хард-скил': 'hard',
			'другое': 'other',
			'дополнительное': 'additional',
			'кнопка': 'button'
    }

    return categories[value] || 'other';
  }

  set buttonText(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }

  setButtonDisabled(state: boolean) {
    if (this._button) {
      this.setDisabled(this._button, state);
    }
  }
}

export class CatalogCard extends Card {
  constructor (container: HTMLElement, actions?: ICardActions) {
    super(container, actions)
  }
}

export class PreviewCard extends Card {
  protected _description: HTMLElement;

  constructor (container: HTMLElement, actions?: ICardActions) {
    super(container, actions)

    this._description = ensureElement<HTMLElement>('.card__text', container);
  }

  set description(value: string) {
    this.setText(this._description, value);
  }
}

export class BasketCard extends Card {
  protected _index: HTMLElement;

  constructor (container: HTMLElement, actions?: ICardActions) {
    super(container, actions)

    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
  }

  set index(value: number) {
    this.setText(this._index, String(value));
  }
}