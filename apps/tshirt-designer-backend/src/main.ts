import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 9000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(bodyParser.json({ limit: '2mb' }));

type Order = {
  id: number;
  productType: string;
  material: string;
  color: string;
  text: string;
  image: string;
  price: number;
  currency: string;
  isImageUploaded: boolean;
};

const API_KEY = '7375b3b6cc8eb92747bbd496cbffd0c6';

const orders: Order[] = [];
let imageChunks: string[] = [];

app.get('/exchangerates', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `https://api.exchangeratesapi.io/latest?access_key=${API_KEY}`
    );
    const rates = response.data.rates;
    const filteredRates = {
      USD: rates.USD ?? null,
      EUR: rates.EUR ?? null,
      CAD: rates.CAD ?? null,
    };
    res.status(200).send(filteredRates);
  } catch (error) {
    // console.error('Error fetching data:', error);
    // res.status(500).send({ error: 'Error fetching data' });
    // For now will send 200 even if error is thrown, if API KEY expires
    res.status(200).send({
      CAD: 1.559263,
      EUR: 1,
      USD: 1.09595,
    });
  }
});

app.post('/orders', async (req: Request, res: Response) => {
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

app.post('/upload-image-chunk', async (req, res) => {
  try {
    const { chunk, chunkIndex, totalChunks } = req.body;
    imageChunks[chunkIndex] = chunk;
    if (imageChunks.length === totalChunks) {
      orders[orders.length - 1].image += imageChunks.join('');
      imageChunks = [];
      return res.status(200).send({ message: 'Image uploaded successfully' });
    }
    return res.status(200).send({ message: 'Chunk received' });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).send({ error: 'Error uploading image' });
  }
});

app.get('/orders', async (req: Request, res: Response) => {
  try {
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send({ error: 'Error fetching orders' });
  }
});

app.get('/orders/:id', async (req: Request, res: Response) => {
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

app.delete('/orders/:id', (req: Request, res: Response) => {
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

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    message: 'app running',
  });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
