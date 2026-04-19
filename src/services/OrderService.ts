import { Order, OrderStatus, OrderItem } from '../models/Order';
import { IOrderRepository } from '../repositories/OrderRepository';
import { ProductService } from './ProductService';
import { PaymentProcessor, PaymentStrategy } from '../strategies/PaymentStrategy';

export class OrderService {
  private _orderRepository: IOrderRepository;
  private _productService: ProductService;
  private _paymentProcessor: PaymentProcessor;

  constructor(
    orderRepository: IOrderRepository, 
    productService: ProductService,
    paymentProcessor: PaymentProcessor
  ) {
    this._orderRepository = orderRepository;
    this._productService = productService;
    this._paymentProcessor = paymentProcessor;
  }

  async createOrder(id: string, customerId: string, items: { productId: string, quantity: number }[]): Promise<Order> {
    const orderItems: OrderItem[] = [];
    
    for (const item of items) {
      const product = await this._productService.getProductById(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
      
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });

      // Reserve stock
      await this._productService.updateStock(product.id, item.quantity);
    }

    const order = new Order(id, customerId, orderItems);
    return this._orderRepository.save(order);
  }

  async processPayment(orderId: string, strategy: PaymentStrategy): Promise<Order> {
    const order = await this._orderRepository.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.status !== OrderStatus.PENDING) throw new Error('Order is not in pending status');

    this._paymentProcessor.setStrategy(strategy);
    const result = await this._paymentProcessor.processPayment({
      amount: order.totalAmount,
      currency: 'USD'
    });

    if (result.success) {
      order.status = OrderStatus.PAID;
      order.transactionId = result.transactionId;
      await this._orderRepository.save(order);
    } else {
      throw new Error('Payment failed');
    }

    return order;
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this._orderRepository.findById(id);
  }

  async getCustomerOrders(customerId: string): Promise<Order[]> {
    return this._orderRepository.findByCustomerId(customerId);
  }
}
