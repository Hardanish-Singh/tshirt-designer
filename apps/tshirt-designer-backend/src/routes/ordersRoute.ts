import { Request, Response, Router } from 'express';
import { orders } from '../contants';
const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .send({ error: 'Invalid request body: Empty object' });
    }
    const order = req.body;
    orders.push({
      ...order,
      id: orders.length,
    });
    return res.status(201).send({ message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).send({ error: 'Error creating order' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send({ error: 'Error fetching orders' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    const order = orders[orderId];
    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).send({ error: 'Error fetching order' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const orderIndex = orders.findIndex((order) => order.id == orderId);
    if (orderIndex == -1) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Remove order from the array
    orders.splice(orderIndex, 1);
    return res.status(200).json({ message: 'Order deleted' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).send({ error: 'Error deleting order' });
  }
});

export default router;
