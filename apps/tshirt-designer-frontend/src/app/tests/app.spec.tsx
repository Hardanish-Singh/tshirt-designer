import { fireEvent, render, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import App from '../app';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.get.mockResolvedValue({
  data: { rates: { CAD: 1.559263, EUR: 1, USD: 1.09595 } },
});

jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('App', () => {
  it('should render the App component successfully', () => {
    const { getByText, baseElement, getAllByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(baseElement).toBeTruthy();
    expect(getAllByText(/T-Shirt Designer/i)).toBeTruthy();
    expect(getByText(/Home/i)).toBeTruthy();
    expect(getByText(/Orders/i)).toBeTruthy();
    expect(getByText(/Select product/i)).toBeTruthy();
    expect(getByText(/Choose product/i)).toBeTruthy();
    expect(getByText(/2025 T-Shirt Designer/i)).toBeTruthy();
  });

  it('should fetch and display currency data', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://0.0.0.0:9000/exchangerates'
      );
    });

    const response = await mockedAxios.get('http://0.0.0.0:9000/exchangerates');

    expect(response.data).toStrictEqual({
      rates: { CAD: 1.559263, EUR: 1, USD: 1.09595 },
    });
  });

  it('should navigate to Orders page when Orders link is clicked', () => {
    const { getByText, getAllByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const ordersLink = getByText(/Orders/i);
    fireEvent.click(ordersLink);

    expect(getAllByText(/Orders/i)).toBeTruthy();
    expect(getByText(/No orders found./i)).toBeTruthy();
  });
});
