import { IContactData, IDeliveryData, IFormState, PaymentMethod } from "../types";
import { ensureAllElements, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

class Form<T> extends Component<IFormState> {
  submitButton: HTMLButtonElement;
  errorsElement: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);
  
    this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${container.name}:submit`);
    });
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:change`, {
      field,
      value
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.setText(this.errorsElement, value);
  }

  render(state: Partial<T> & IFormState) {
    const {valid, errors, ...inputs} = state;
    super.render({valid, errors});
    Object.assign(this, inputs);
    return this.container;
  }
}

export class DeliveryForm extends Form<IDeliveryData> {
  paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
  
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        const method = button.name === 'card' ? 'online' : 'cash';

        this.events.emit('order.payment:set', { method });
      });
    });
  }

  set payment(value: PaymentMethod) {
    // Удаляем класс активности со всех
    this.paymentButtons.forEach(button => {
      button.classList.remove('button_alt-active');
    });

    // Ищем нужную и добавляем активный стиль
    const active = this.paymentButtons.find(button => {
      if (value === 'online') return button.name === 'card';
      if (value === 'cash') return button.name === 'cash';
      return false;
    });

    if (active) {
      active.classList.add('button_alt-active');
    }
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}

export class ContactForm extends Form<IContactData> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }
}
