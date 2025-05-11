import { act, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import Orders from '../components/Orders';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Orders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for an empty state (no orders)
  it('renders loading state initially (no orders)', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    await act(async () => {
      render(
        <Router>
          <Orders currency={{ USD: 1 }} />
        </Router>
      );
    });

    // Wait for the component to finish rendering
    expect(screen.getByText('Orders')).toBeTruthy();
    expect(screen.getByText('No orders found.')).toBeTruthy();
  });

  // Test when orders are successfully fetched and displayed
  it('renders orders when data is fetched successfully', async () => {
    const ordersData = [
      {
        productType: 'T-shirt',
        material: 'Cotton',
        color: 'Red',
        text: 'Custom Text',
        image: 'http://0.0.0.0:9000/image1.jpg',
        price: 25,
        currency: 'USD',
        isImageUploaded: true,
      },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: ordersData });

    await act(async () => {
      render(
        <Router>
          <Orders currency={{ USD: 1 }} />
        </Router>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Item: T-shirt')).toBeTruthy();
      expect(screen.getByText('Material: Cotton')).toBeTruthy();
      expect(screen.getByText('Color: Red')).toBeTruthy();
      expect(screen.getByText('Price: 25.00')).toBeTruthy();
      expect(screen.getByText('T-shirt Text: Custom Text')).toBeTruthy();
    });
  });
});
