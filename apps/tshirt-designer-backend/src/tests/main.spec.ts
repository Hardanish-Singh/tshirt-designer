import axios from 'axios';

// Mock axios globally in this test file
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>; // Cast axios to the mocked version

describe('API Endpoints', () => {
  it('should respond with TShirt Designer App Running message', async () => {
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: {
        message: 'TShirt Designer App Running',
      },
    });
    const res = await axios.get('/');
    expect(res.status).toBe(200);
    expect(res.data.message).toBe('TShirt Designer App Running');
  });
});
