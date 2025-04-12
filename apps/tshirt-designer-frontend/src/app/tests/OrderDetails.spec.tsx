import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import OrderDetails from '../components/OrderDetails';

// Mock axios and react-router-dom
jest.mock('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(() => jest.fn()),
}));

jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('OrderDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for loading state
  it('renders loading state', () => {
    jest
      .spyOn(require('react-router-dom'), 'useParams')
      .mockReturnValue({ id: '123' });
    const { baseElement } = render(
      <Router>
        <OrderDetails currency={{ USD: 1 }} />
      </Router>
    );
    expect(baseElement).toBeTruthy();
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  // Test when order ID is invalid (no ID in the URL)
  it('renders Invalid order ID message when no id in URL', () => {
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({});
    render(
      <Router>
        <OrderDetails currency={{ USD: 1 }} />
      </Router>
    );
    expect(screen.getByText('Invalid order ID.')).toBeTruthy();
  });

  // Test when order is not found (API fails)
  it('renders "Order not found" when the order data is not found', async () => {
    jest
      .spyOn(require('react-router-dom'), 'useParams')
      .mockReturnValue({ id: '123' });
    (axios.get as jest.Mock).mockRejectedValueOnce(
      new Error('Order not found')
    );
    render(
      <Router>
        <OrderDetails currency={{ USD: 1 }} />
      </Router>
    );
    await waitFor(() =>
      expect(screen.getByText('Order not found.')).toBeTruthy()
    );
  });

  // Test when order details are successfully fetched
  it('renders order details when data is fetched successfully', async () => {
    jest
      .spyOn(require('react-router-dom'), 'useParams')
      .mockReturnValue({ id: '123' });
    const orderData = {
      id: '123',
      image: 'http://0.0.0.0:9000/image.jpg',
      productType: 'T-shirt',
      material: 'Cotton',
      color: 'Red',
      text: 'Custom Text',
      price: 25,
      currency: 'USD',
    };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: orderData });
    render(
      <Router>
        <OrderDetails currency={{ USD: 1 }} />
      </Router>
    );
    await waitFor(() => expect(screen.getByText('Item: T-shirt')).toBeTruthy());
    expect(screen.getByText('Material: Cotton')).toBeTruthy();
    expect(screen.getByText('Color: Red')).toBeTruthy();
    expect(screen.getByText('T-shirt Text: Custom Text')).toBeTruthy();
    expect(screen.getByText('Price: 25.00')).toBeTruthy();
  });
});
