export const FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const TIMEOUT = 500; // 500ms

// Initial state for order form
export const initialOrder = {
  productType: '',
  material: '',
  color: '',
  text: '',
  image: '',
  price: 0,
  currency: 'CAD', // Default currency
  isImageUploaded: false,
};
