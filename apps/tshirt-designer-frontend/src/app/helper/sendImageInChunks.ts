import axios from 'axios';

export async function sendImageInChunks(base64String: string) {
  const chunkSize = 2000; // Size of each chunk in bytes
  const totalChunks = Math.ceil(base64String.length / chunkSize);
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const chunk = base64String.slice(start, end);
    try {
      await axios.post(
        'http://0.0.0.0:9000/upload-image-chunk',
        {
          chunk,
          chunkIndex: i,
          totalChunks,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Error sending chunk:', error);
    }
  }
}
