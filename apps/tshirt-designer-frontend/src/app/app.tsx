import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import OrderDetails from './components/OrderDetails';
import Orders from './components/Orders';
import { Currency } from './types/types';

const App = () => {
  const [currency, setCurrency] = useState<Currency>({});

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('http://0.0.0.0:9000/exchangerates');
        setCurrency(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">T-Shirt Designer</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>{' '}
              </li>
              <li>
                <Link to="/orders" className="hover:underline">
                  Orders
                </Link>{' '}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<Home currency={currency} />} />
            <Route path="/orders" element={<Orders currency={currency} />} />
            <Route
              path="/orders/:id"
              element={<OrderDetails currency={currency} />}
            />
          </Routes>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 T-Shirt Designer</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
