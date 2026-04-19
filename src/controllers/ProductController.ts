import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
  private _productService: ProductService;

  constructor(productService: ProductService) {
    this._productService = productService;
  }

  async listProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this._productService.getAllProducts();
      res.json(products.map(p => p.toJSON()));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params['id'] as string;
      const product = await this._productService.getProductById(id);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(product.toJSON());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id, name, description, price, stock } = req.body;
      const product = await this._productService.createProduct(id, name, description, price, stock);
      res.status(201).json(product.toJSON());
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
