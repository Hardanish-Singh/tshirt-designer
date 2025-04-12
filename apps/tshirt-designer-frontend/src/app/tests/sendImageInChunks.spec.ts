import axios from 'axios';
import { sendImageInChunks } from '../helper/sendImageInChunks';

jest.mock('axios'); // Mock axios module

describe('sendImageInChunks', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  it('should send image in chunks correctly when base64 string is less than chunk size', async () => {
    const base64String = 'a'.repeat(1500); // A base64 string smaller than 2000 bytes
    const mockResponse = { status: 200, data: 'success' };

    // Mock the axios.post call to resolve with a success response
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    await sendImageInChunks(base64String);

    // Ensure axios.post was called once
    expect(axios.post).toHaveBeenCalledTimes(1);
    // Ensure axios.post was called with the correct parameters
    expect(axios.post).toHaveBeenCalledWith(
      'http://0.0.0.0:9000/upload-image-chunk',
      {
        chunk: base64String,
        chunkIndex: 0,
        totalChunks: 1,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  });

  it('should send image in multiple chunks correctly when base64 string is larger than chunk size', async () => {
    const base64String = 'a'.repeat(5000); // A base64 string larger than 2000 bytes
    const mockResponse = { status: 200, data: 'success' };

    // Mock the axios.post call to resolve with a success response
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    await sendImageInChunks(base64String);

    // Verify axios.post was called the correct number of times (ceil(5000 / 2000) = 3)
    expect(axios.post).toHaveBeenCalledTimes(3);

    // Verify each chunk has been sent correctly
    expect(axios.post).toHaveBeenNthCalledWith(
      1,
      'http://0.0.0.0:9000/upload-image-chunk',
      {
        chunk: 'a'.repeat(2000), // First chunk
        chunkIndex: 0,
        totalChunks: 3,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    expect(axios.post).toHaveBeenNthCalledWith(
      2,
      'http://0.0.0.0:9000/upload-image-chunk',
      {
        chunk: 'a'.repeat(2000), // Second chunk
        chunkIndex: 1,
        totalChunks: 3,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    expect(axios.post).toHaveBeenNthCalledWith(
      3,
      'http://0.0.0.0:9000/upload-image-chunk',
      {
        chunk: 'a'.repeat(1000), // Last chunk (less than chunk size)
        chunkIndex: 2,
        totalChunks: 3,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
  });

  it('should handle an empty base64 string', async () => {
    const base64String = ''; // Empty string

    // Mock the axios.post call to resolve with a success response
    const mockResponse = { status: 200, data: 'success' };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    // Call the function
    await sendImageInChunks(base64String);

    // Verify that axios.post was not called because there are no chunks
    expect(axios.post).not.toHaveBeenCalled();
  });
});
