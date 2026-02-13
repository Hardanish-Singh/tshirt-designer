import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Currency } from '../types/types';

type OrderDetailsProps = {
  currency: Currency;
};

const OrderDetails = ({ currency }: OrderDetailsProps) => {
  const { id } = useParams(); // Fetch the order ID from the URL
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  if (!id) {
    return <div>Invalid order ID.</div>;
  }

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://0.0.0.0:9000/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        navigate('/orders'); // Redirect if error or order not found
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Orders</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-1/3 m-auto">
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
        {order?.color && <p className="text-gray-600">Color: {order?.color}</p>}
        {order?.text && (
          <p className="text-gray-600">T-shirt Text: {order?.text}</p>
        )}
        <p className="text-gray-600 font-bold">
          Price: {(order?.price * (currency[order?.currency] || 1)).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
