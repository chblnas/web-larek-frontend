import { ISuccess } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  totalElement: HTMLElement;
  buttonClose: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this.totalElement = ensureElement<HTMLElement>('.order-success__description', container);
    this.buttonClose = ensureElement<HTMLButtonElement>('.order-success__close', container);

    if (actions?.onClick) {
      this.buttonClose.addEventListener('click', actions.onClick);
    }
  }

  set total(value: number) {
    this.setText(this.totalElement, `Списано ${value} синапсов`);
  }
}