export interface PaymentDetails {
  amount: number;
  currency: string;
}

export interface PaymentStrategy {
  pay(details: PaymentDetails): Promise<{ success: boolean; transactionId: string }>;
}

export class CreditCardStrategy implements PaymentStrategy {
  private _cardNumber: string;
  private _cvv: string;
  private _expiry: string;

  constructor(cardNumber: string, cvv: string, expiry: string) {
    this._cardNumber = cardNumber;
    this._cvv = cvv;
    this._expiry = expiry;
  }

  async pay(details: PaymentDetails): Promise<{ success: boolean; transactionId: string }> {
    console.log(`Processing credit card payment of ${details.amount} ${details.currency}`);
    // Mock processing logic
    return {
      success: true,
      transactionId: `CC-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
    };
  }
}

export class UPIStrategy implements PaymentStrategy {
  private _vpa: string;

  constructor(vpa: string) {
    this._vpa = vpa;
  }

  async pay(details: PaymentDetails): Promise<{ success: boolean; transactionId: string }> {
    console.log(`Processing UPI payment of ${details.amount} ${details.currency} via VPA: ${this._vpa}`);
    // Mock processing logic
    return {
      success: true,
      transactionId: `UPI-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
    };
  }
}

export class PaymentProcessor {
  private _strategy: PaymentStrategy | null = null;

  public setStrategy(strategy: PaymentStrategy): void {
    this._strategy = strategy;
  }

  public async processPayment(details: PaymentDetails): Promise<{ success: boolean; transactionId: string }> {
    if (!this._strategy) {
      throw new Error('Payment strategy not set');
    }
    return this._strategy.pay(details);
  }
}
