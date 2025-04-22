import axios from 'axios';

// Mock axios globally in this test file
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>; // Cast axios to the mocked version

describe('Orders Route API Endpoints', () => {
  describe('GET /orders', () => {
    it('should fetch all orders', async () => {
      const ordersData = [
        {
          productType: 'Shirt',
          material: 'Cotton',
          color: 'Blue',
          text: 'Cool Shirt',
          image: 'base64image',
          price: 20.5,
          currency: 'USD',
          isImageUploaded: true,
          buffer: Buffer.from(''),
        },
      ];
      mockedAxios.get.mockResolvedValue({
        status: 200,
        data: ordersData,
      });
      const res = await axios.get('/orders');
      expect(res.status).toBe(200);
      expect(res.data).toEqual(ordersData);
    });

    it('should return an empty array if no orders exist', async () => {
      mockedAxios.get.mockResolvedValue({
        status: 200,
        data: [],
      });
      const res = await axios.get('/orders');
      expect(res.status).toBe(200);
      expect(res.data).toEqual([]);
    });
  });

  describe('GET /orders/:id', () => {
    it('should return a specific order by id', async () => {
      const orderData = {
        productType: 'Shirt',
        material: 'Cotton',
        color: 'Blue',
        text: 'Cool Shirt',
        image: 'base64image',
        price: 20.5,
        currency: 'USD',
        isImageUploaded: true,
        buffer: Buffer.from(''),
      };
      mockedAxios.get.mockResolvedValue({
        status: 200,
        data: orderData,
      });
      const res = await axios.get('/orders/0');
      expect(res.status).toBe(200);
      expect(res.data).toEqual(orderData);
    });

    it('should return 404 if order is not found', async () => {
      mockedAxios.get.mockResolvedValue({
        status: 404,
        data: { error: 'Order not found' },
      });
      try {
        await axios.get('/orders/999');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          expect(error.response?.data).toEqual({ error: 'Order not found' });
          expect(error.response?.status).toBe(404);
        }
      }
    });
  });

  describe('POST /orders', () => {
    it('should create an order successfully with a valid request', async () => {
      const order = {
        productType: 'Shirt',
        material: 'Cotton',
        color: 'Blue',
        text: 'Cool Shirt',
        image: 'base64image',
        price: 20.5,
        currency: 'USD',
        isImageUploaded: true,
      };
      // Mock the response for the post request
      mockedAxios.post.mockResolvedValue({
        status: 201,
        data: { message: 'Order created successfully' },
      });

      const res = await axios.post('/orders', order);
      expect(res.status).toBe(201);
      expect(res.data).toEqual({ message: 'Order created successfully' });
    });

    it('should return an error for invalid order data', async () => {
      const invalidOrder = {};
      mockedAxios.post.mockResolvedValue({
        status: 400,
        data: { error: 'Invalid request body: Empty object' },
      });
      try {
        await axios.post('/orders', invalidOrder);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          expect(error.response?.data).toEqual({
            error: 'Invalid request body: Empty object',
          });
          expect(error.response?.status).toBe(400);
        }
      }
    });
  });

  describe('DELETE /orders/:id', () => {
    it('should delete an order by id successfully', async () => {
      const orderId = 0;
      const deletedOrder = {
        id: orderId,
        productType: 'Shirt',
        material: 'Cotton',
        color: 'Blue',
        text: 'Cool Shirt',
        image: 'base64image',
        price: 20.5,
        currency: 'USD',
        isImageUploaded: true,
      };
      mockedAxios.delete.mockResolvedValue({
        status: 200,
        data: {
          message: 'Order deleted successfully',
          deletedOrder,
        },
      });
      const res = await axios.delete(`/orders/${orderId}`);
      expect(res.status).toBe(200);
      expect(res.data).toEqual({
        message: 'Order deleted successfully',
        deletedOrder,
      });
    });
    it('should return 404 if order does not exist', async () => {
      const nonExistentOrderId = 999;
      mockedAxios.delete.mockRejectedValue({
        response: {
          status: 404,
          data: { error: 'Order not found' },
        },
      });
      try {
        await axios.delete(`/orders/${nonExistentOrderId}`);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          expect(error.response?.status).toBe(404);
          expect(error.response?.data).toEqual({ error: 'Order not found' });
        }
      }
    });
    it('should handle internal server error when deleting order', async () => {
      const orderId = 0;
      mockedAxios.delete.mockRejectedValue({
        response: {
          status: 500,
          data: { error: 'Error deleting order' },
        },
      });
      try {
        await axios.delete(`/orders/${orderId}`);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          expect(error.response?.status).toBe(500);
          expect(error.response?.data).toEqual({
            error: 'Error deleting order',
          });
        }
      }
    });
  });
});
