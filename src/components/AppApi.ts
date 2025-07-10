import { IOrder, IOrderResult, IProduct } from "../types";
import { Api } from "./base/api";

type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export class AppApi extends Api {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getProductItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then(
      (item: IProduct) => ({
        ...item,
        image: this.cdn + item.image,
      })
    )
  }

  getProductList(): Promise<IProduct[]> {
    return this.get('/product/').then(
      (data: ApiListResponse<IProduct>) => data.items.map((item: IProduct) => ({
        ...item,
        image: this.cdn + item.image
      }))
    )
  }

  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order)
      .then((data: IOrderResult) => data);
  }
}