import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Currency, Order } from '../types/types';

type OrdersProps = {
  currency: Currency;
};

const Orders = ({ currency }: OrdersProps) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('http://0.0.0.0:9000/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    })();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold text-center mb-6">Orders</h2>
        <p className="text-center">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Orders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders.map((order: Order) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            {order?.image && (
              <img
                src={order?.image}
                alt={`Order Image Not Found `}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            {order?.productType && (
              <p className="text-gray-600 mt-2">Item: {order?.productType}</p>
            )}
            {order?.material && (
              <p className="text-gray-600">Material: {order?.material}</p>
            )}
            {order?.color && (
              <p className="text-gray-600">Color: {order?.color}</p>
            )}
            {order?.text && (
              <p className="text-gray-600">T-shirt Text: {order?.text}</p>
            )}
            <p className="text-gray-600 font-bold">
              Price:{' '}
              {(order?.price * (currency[order?.currency] || 1)).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
