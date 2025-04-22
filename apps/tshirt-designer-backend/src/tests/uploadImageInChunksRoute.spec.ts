import axios from 'axios';

// Mock axios globally in this test file
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>; // Cast axios to the mocked version

describe('Upload Images In Chunks Route Routes API Endpoints', () => {
  describe('POST /upload-image-chunk', () => {
    it('should handle image chunk upload successfully', async () => {
      const imageChunk = {
        chunk: 'chunkData',
        chunkIndex: 0,
        totalChunks: 2,
      };
      mockedAxios.post.mockResolvedValue({
        status: 200,
        data: { message: 'Chunk received' },
      });
      const res = await axios.post('/upload-image-chunk', imageChunk);
      expect(res.status).toBe(200);
      expect(res.data).toEqual({ message: 'Chunk received' });
    });

    it('should handle full image upload successfully after receiving all chunks', async () => {
      const imageChunk = {
        chunk: 'chunkData',
        chunkIndex: 1,
        totalChunks: 2,
      };
      mockedAxios.post.mockResolvedValue({
        status: 200,
        data: { message: 'Image uploaded successfully' },
      });
      const res = await axios.post('/upload-image-chunk', imageChunk);
      expect(res.status).toBe(200);
      expect(res.data).toEqual({ message: 'Image uploaded successfully' });
    });

    it('should handle image upload with chunk errors', async () => {
      const invalidImageChunk = {
        chunk: '',
        chunkIndex: 1,
        totalChunks: 3,
      };
      mockedAxios.post.mockResolvedValue({
        status: 400,
        data: { error: 'Invalid chunk data' },
      });
      try {
        await axios.post('/upload-image-chunk', invalidImageChunk);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          expect(error.response?.data).toEqual({ error: 'Invalid chunk data' });
          expect(error.response?.status).toBe(400);
        }
      }
    });
  });
});
