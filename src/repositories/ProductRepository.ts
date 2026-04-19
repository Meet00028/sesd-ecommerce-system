import { Product } from '../models/Product';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}

export class ProductRepository implements IProductRepository {
  private _products: Map<string, Product> = new Map();

  async findById(id: string): Promise<Product | null> {
    return this._products.get(id) || null;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this._products.values());
  }

  async save(product: Product): Promise<Product> {
    this._products.set(product.id, product);
    return product;
  }

  async delete(id: string): Promise<void> {
    this._products.delete(id);
  }
}
