import { Order } from '../models/Order';

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<Order>;
  findByCustomerId(customerId: string): Promise<Order[]>;
}

export class OrderRepository implements IOrderRepository {
  private _orders: Map<string, Order> = new Map();

  async findById(id: string): Promise<Order | null> {
    return this._orders.get(id) || null;
  }

  async save(order: Order): Promise<Order> {
    this._orders.set(order.id, order);
    return order;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    return Array.from(this._orders.values()).filter(o => o.customerId === customerId);
  }
}
