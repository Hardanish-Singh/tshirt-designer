import { Router } from 'express';
import { orders } from '../contants';
const router = Router();

let imageChunks: string[] = [];

router.post('/', async (req, res) => {
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

export default router;
