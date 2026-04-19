import { Product } from '../models/Product';
import { IProductRepository } from '../repositories/ProductRepository';

export class ProductService {
  private _productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this._productRepository = productRepository;
  }

  async getAllProducts(): Promise<Product[]> {
    return this._productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this._productRepository.findById(id);
  }

  async createProduct(id: string, name: string, description: string, price: number, stock: number): Promise<Product> {
    const product = new Product(id, name, description, price, stock);
    return this._productRepository.save(product);
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    const product = await this._productRepository.findById(id);
    if (!product) throw new Error('Product not found');
    
    product.stock -= quantity;
    await this._productRepository.save(product);
  }
}
