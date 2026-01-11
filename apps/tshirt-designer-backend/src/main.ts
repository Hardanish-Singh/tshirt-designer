import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import exchangeRatesRoute from './routes/exchangeRatesRoute';
import ordersRoute from './routes/ordersRoute';
import uploadImageInChunksRoute from './routes/uploadImageInChunksRoute';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 9000;

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(cors());
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(bodyParser.json({ limit: '2mb' }));

app.use('/exchangerates', exchangeRatesRoute);
app.use('/upload-image-chunk', uploadImageInChunksRoute);
app.use('/orders', ordersRoute);

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    message: 'app running',
  });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
