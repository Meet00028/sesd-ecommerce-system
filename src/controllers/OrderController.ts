import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { CreditCardStrategy, UPIStrategy } from '../strategies/PaymentStrategy';

export class OrderController {
  private _orderService: OrderService;

  constructor(orderService: OrderService) {
    this._orderService = orderService;
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id, customerId, items } = req.body;
      const order = await this._orderService.createOrder(id, customerId, items);
      res.status(201).json(order.toJSON());
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async payOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params['id'] as string;
      const { paymentMethod, paymentDetails } = req.body;

      let strategy;
      if (paymentMethod === 'CREDIT_CARD') {
        strategy = new CreditCardStrategy(
          paymentDetails.cardNumber,
          paymentDetails.cvv,
          paymentDetails.expiry
        );
      } else if (paymentMethod === 'UPI') {
        strategy = new UPIStrategy(paymentDetails.vpa);
      } else {
        res.status(400).json({ error: 'Invalid payment method' });
        return;
      }

      const order = await this._orderService.processPayment(orderId, strategy);
      res.json(order.toJSON());
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params['id'] as string;
      const order = await this._orderService.getOrderById(id);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.json(order.toJSON());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCustomerOrders(req: Request, res: Response): Promise<void> {
    try {
      const customerId = req.params['customerId'] as string;
      const orders = await this._orderService.getCustomerOrders(customerId);
      res.json(orders.map(o => o.toJSON()));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
