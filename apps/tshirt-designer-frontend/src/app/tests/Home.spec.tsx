import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Home from '../components/Home';

// Mocking the axios and helper functions
jest.mock('axios');

jest.mock('../helper/calculatePrice', () => ({
  calculatePrice: jest.fn(() => 10), // Example price calculation
}));

jest.mock('../helper/sendImageInChunks', () => ({
  sendImageInChunks: jest.fn(),
}));

jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Home component tests', () => {
  const currency = { USD: 1, EUR: 0.85 }; // Example currency for testing

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product type and material dropdowns', () => {
    render(<Home currency={currency} />);
    // Test if product type dropdown is rendered
    const productTypeSelect = screen.getByLabelText(/select product/i);
    expect(productTypeSelect).toBeTruthy();
    // Test if material dropdown is rendered when product type is selected
    fireEvent.change(productTypeSelect, { target: { value: 'tshirt' } });
    const materialSelect = screen.getByLabelText(/select material/i);
    expect(materialSelect).toBeTruthy();
  });

  it('handles product type and material change', () => {
    render(<Home currency={currency} />);
    const productTypeSelect = screen.getByLabelText(/select product/i);
    fireEvent.change(productTypeSelect, { target: { value: 'tshirt' } });
    const materialSelect = screen.getByLabelText(/select material/i) as any;
    fireEvent.change(materialSelect, { target: { value: 'Light Cotton' } });
    // Check if the state updates correctly
    expect(materialSelect.value).toBe('Light Cotton');
  });

  it('submits the form and shows success toast', async () => {
    render(<Home currency={currency} />);

    const productTypeSelect = screen.getByLabelText(/select product/i);
    expect(productTypeSelect).toBeTruthy();
    fireEvent.change(productTypeSelect, { target: { value: 'tshirt' } });

    const materialSelect = screen.getByLabelText(/select material/i);
    fireEvent.change(materialSelect, { target: { value: 'Light Cotton' } });

    const colorSelect = screen.getByLabelText(/select color/i);
    fireEvent.change(colorSelect, { target: { value: 'white' } });

    const fileInput = screen.getByLabelText(
      /Upload picture/i
    ) as HTMLInputElement;
    const file = new File(['dummy content'], 'image.jpg', {
      type: 'image/jpeg',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitButton = screen.getByRole('button', { name: /submit order/i });

    // Mock axios post request
    (axios.post as jest.Mock).mockResolvedValue({
      data: { message: 'Order created successfully' },
    });

    // Trigger submit
    fireEvent.click(submitButton);

    // Wait for toast success message
    await waitFor(() => {
      expect(screen.getByText(/Order created successfully/i)).toBeTruthy();
    });
  });

  it('displays error toast when form submission fails', async () => {
    render(<Home currency={currency} />);

    const productTypeSelect = screen.getByLabelText(/select product/i);
    expect(productTypeSelect).toBeTruthy();
    fireEvent.change(productTypeSelect, { target: { value: 'tshirt' } });

    const materialSelect = screen.getByLabelText(/select material/i);
    fireEvent.change(materialSelect, { target: { value: 'Light Cotton' } });

    const colorSelect = screen.getByLabelText(/select color/i);
    fireEvent.change(colorSelect, { target: { value: 'white' } });

    const fileInput = screen.getByLabelText(
      /Upload picture/i
    ) as HTMLInputElement;
    const file = new File(['dummy content'], 'image.jpg', {
      type: 'image/jpeg',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitButton = screen.getByRole('button', { name: /submit order/i });

    // Mock axios post request to simulate an error
    (axios.post as jest.Mock).mockRejectedValue(new Error('Request failed'));

    // Trigger submit
    fireEvent.click(submitButton);

    // Wait for toast error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to create order./i)).toBeTruthy();
    });
  });
});
