import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Package, CreditCard, CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const checkout = async () => {
    setLoading(true);
    try {
      // 1. Create Order
      const orderRes = await axios.post(`${API_BASE}/orders`, {
        id: `ORD-${Date.now()}`,
        customerId: 'cust-123',
        items: cart.map(item => ({ productId: item.id, quantity: item.quantity }))
      });

      // 2. Pay Order (Using UPI strategy as example)
      const payRes = await axios.post(`${API_BASE}/orders/${orderRes.data.id}/pay`, {
        paymentMethod: 'UPI',
        paymentDetails: { vpa: 'customer@upi' }
      });

      setOrder(payRes.data);
      setCart([]);
      fetchProducts(); // Refresh stock
    } catch (err) {
      alert('Checkout failed: ' + (err as any).response?.data?.error || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
          <Package size={32} /> ShopCore
        </h1>
        <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow">
          <ShoppingCart />
          <span className="font-bold">{cart.reduce((s, i) => s + i.quantity, 0)} Items</span>
          <span className="text-green-600 font-bold">${cart.reduce((s, i) => s + i.price * i.quantity, 0)}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Product List */}
        <section className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">{p.name}</h3>
              <p className="text-gray-600 mb-4">{p.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">${p.price}</span>
                <span className={`text-sm ${p.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  Stock: {p.stock}
                </span>
              </div>
              <button
                onClick={() => addToCart(p)}
                disabled={p.stock === 0}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-bold disabled:bg-gray-400"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </section>

        {/* Cart & Checkout */}
        <aside className="bg-white p-6 rounded-xl shadow-sm h-fit">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CreditCard /> Checkout
          </h2>
          {cart.length === 0 ? (
            <p className="text-gray-500 italic">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between border-b pb-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-bold">${item.price * item.quantity}</span>
                </div>
              ))}
              <div className="pt-4 border-t text-xl font-bold flex justify-between">
                <span>Total:</span>
                <span className="text-blue-600">${cart.reduce((s, i) => s + i.price * i.quantity, 0)}</span>
              </div>
              <button
                onClick={checkout}
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : 'Place Order & Pay'}
              </button>
            </div>
          )}

          {order && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <h3 className="font-bold flex items-center gap-2 mb-2">
                <CheckCircle size={20} /> Success!
              </h3>
              <p className="text-sm">Order ID: {order.id}</p>
              <p className="text-sm">Transaction: {order.transactionId}</p>
              <p className="text-xs mt-2 italic text-green-600">Payment processed via Strategy Pattern</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
