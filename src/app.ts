import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Repositories
import { UserRepository } from './repositories/UserRepository';
import { ProductRepository } from './repositories/ProductRepository';
import { OrderRepository } from './repositories/OrderRepository';

// Services
import { UserService } from './services/UserService';
import { ProductService } from './services/ProductService';
import { OrderService } from './services/OrderService';

// Controllers
import { UserController } from './controllers/UserController';
import { ProductController } from './controllers/ProductController';
import { OrderController } from './controllers/OrderController';

// Strategies
import { PaymentProcessor } from './strategies/PaymentStrategy';

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL, // Vercel URL
  'http://localhost:5173',
  'http://localhost:5174'
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());

// Dependency Injection (Manual)
const userRepository = new UserRepository();
const productRepository = new ProductRepository();
const orderRepository = new OrderRepository();

const userService = new UserService(userRepository);
const productService = new ProductService(productRepository);
const paymentProcessor = new PaymentProcessor();
const orderService = new OrderService(orderRepository, productService, paymentProcessor);

const userController = new UserController(userService);
const productController = new ProductController(productService);
const orderController = new OrderController(orderService);

// Seeding some initial products for Phase 4/5 testing
productService.createProduct('p1', 'Laptop', 'High performance laptop', 1200, 10);
productService.createProduct('p2', 'Mouse', 'Wireless optical mouse', 25, 50);
productService.createProduct('p3', 'Keyboard', 'Mechanical keyboard', 80, 20);

// Routes

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'ShopCore Backend is running', phase: 4 });
});

// User Routes
app.post('/api/users/register', (req, res) => userController.register(req, res));
app.get('/api/users/:id', (req, res) => userController.getUser(req, res));

// Product Routes
app.get('/api/products', (req, res) => productController.listProducts(req, res));
app.get('/api/products/:id', (req, res) => productController.getProduct(req, res));
app.post('/api/products', (req, res) => productController.createProduct(req, res));

// Order Routes
app.post('/api/orders', (req, res) => orderController.createOrder(req, res));
app.get('/api/orders/:id', (req, res) => orderController.getOrder(req, res));
app.post('/api/orders/:id/pay', (req, res) => orderController.payOrder(req, res));
app.get('/api/customers/:customerId/orders', (req, res) => orderController.getCustomerOrders(req, res));

export default app;
