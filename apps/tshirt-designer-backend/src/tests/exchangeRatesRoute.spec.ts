import axios from 'axios';

// Mock axios globally in this test file
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>; // Cast axios to the mocked version

describe('ExchangeRates Routes API Endpoints', () => {
  describe('GET /exchangerates', () => {
    it('should return filtered exchange rates', async () => {
      // Mock the response of axios.get()
      mockedAxios.get.mockResolvedValue({
        status: 200,
        data: {
          rates: {
            CAD: 1.559263,
            EUR: 1,
            USD: 1.09595,
          },
        },
      });
      const res = await axios.get(`/exchangerates`); // This uses the mocked axios
      expect(res.data).toStrictEqual({
        rates: {
          CAD: 1.559263,
          EUR: 1,
          USD: 1.09595,
        },
      });
      expect(res.status).toBe(200);
    });

    it('should handle errors from the API', async () => {
      // Mock the response of axios.get() to simulate an error
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));
      try {
        await axios.get(`/exchangerates`); // This uses the mocked axios
      } catch (error) {
        // Check if the error is an AxiosError using axios.isAxiosError
        if (axios.isAxiosError(error)) {
          // Assertion to check if the error is handled correctly
          expect(error.message).toBe('Network Error');
        }
      }
    });
  });
});
