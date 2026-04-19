export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export class Order {
  private _id: string;
  private _customerId: string;
  private _items: OrderItem[];
  private _totalAmount: number;
  private _status: OrderStatus;
  private _transactionId?: string;

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this._totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this._status = OrderStatus.PENDING;
  }

  public get id(): string { return this._id; }
  public get customerId(): string { return this._customerId; }
  public get items(): OrderItem[] { return [...this._items]; }
  public get totalAmount(): number { return this._totalAmount; }
  
  public get status(): OrderStatus { return this._status; }
  public set status(value: OrderStatus) { this._status = value; }

  public get transactionId(): string | undefined { return this._transactionId; }
  public set transactionId(value: string | undefined) { this._transactionId = value; }

  public toJSON() {
    return {
      id: this._id,
      customerId: this._customerId,
      items: this._items,
      totalAmount: this._totalAmount,
      status: this._status,
      transactionId: this._transactionId,
    };
  }
}
