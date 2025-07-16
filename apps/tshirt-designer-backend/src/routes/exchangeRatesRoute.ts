import axios from 'axios';
import { Request, Response, Router } from 'express';
const router = Router();

const API_KEY = '7375b3b6cc8eb92747bbd496cbffd0c6';
router.get('/', async (req: Request, res: Response) => {
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
    // For now will send 200 even if error is thrown, if API_KEY expires
    res.status(200).send({
      CAD: 1.559263,
      EUR: 1,
      USD: 1.09595,
    });
  }
});

export default router;
