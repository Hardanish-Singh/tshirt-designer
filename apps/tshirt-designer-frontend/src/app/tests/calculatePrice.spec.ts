import { calculatePrice } from '../helper/calculatePrice';

describe('calculatePrice', () => {
  // Test case for tshirt product type with various color and material combinations
  it('should return the correct price for a tshirt with green color and light material', () => {
    const order = {
      productType: 'tshirt',
      color: 'green',
      material: 'light',
      text: '',
      image: '',
      price: 0,
      currency: 'CAD',
      isImageUploaded: false,
    };
    expect(calculatePrice(order)).toBe(18.95);
  });

  it('should return the correct price for a tshirt with black color and light material', () => {
    const order = {
      productType: 'tshirt',
      color: 'black',
      material: 'light',
      text: '',
      image: '',
      price: 0,
      currency: 'CAD',
      isImageUploaded: false,
    };
    expect(calculatePrice(order)).toBe(16.95);
  });

  it('should add price for heavy material tshirt', () => {
    const order = {
      productType: 'tshirt',
      color: 'green',
      material: 'heavy',
      text: '',
      image: '',
      price: 0,
      currency: 'CAD',
      isImageUploaded: false,
    };
    expect(calculatePrice(order)).toBe(21.95); // base price + 3 for heavy material
  });

  it('should add price for long text on a tshirt', () => {
    const order = {
      productType: 'tshirt',
      color: 'green',
      material: 'light',
      text: 'This is a long text',
      image: '',
      price: 0,
      currency: 'CAD',
      isImageUploaded: false,
    };
    expect(calculatePrice(order)).toBe(23.95); // base price + 5 for long text
  });

  it('should add price for an image on a tshirt', () => {
    const order = {
      productType: 'tshirt',
      color: 'green',
      material: 'light',
      text: '',
      image: 'image1',
      price: 0,
      currency: 'CAD',
      isImageUploaded: false,
    };
    expect(calculatePrice(order)).toBe(28.95); // base price + 10 for image
  });

  it('should add price for heavy cotton material on a tshirt', () => {
    const order = {
      productType: 'tshirt',
      color: 'green',
      material: 'Heavy Cotton',
      text: '',
      image: '',
      price: 0,
      currency: 'CAD',
      isImageUploaded: false,
    };
    expect(calculatePrice(order)).toBe(21.95); // base price + 3 for heavy cotton material
  });

  it('should return the correct price for a sweater with pink color', () => {
    const order = {
      productType: 'sweater',
      color: 'pink',
      material: 'light',
      text: '',
      image: '',
      price: 0,
      currency: 'CAD',
      isImageUploaded: false,
    };
    expect(calculatePrice(order)).toBe(32.95);
  });

  it('should return the correct price for a sweater with black color', () => {
    const order = {
      productType: 'sweater',
      color: 'black',
      material: 'light',
      text: '',
      image: '',
      price: 0,
      currency: 'CAD',
      isImageUploaded: false,
    };
    expect(calculatePrice(order)).toBe(28.95);
  });

  it('should return the correct price for a sweater with yellow color', () => {
    const order = {
      productType: 'sweater',
      color: 'yellow',
      material: 'light',
      text: '',
      image: '',
      price: 0,
      currency: 'CAD',
      isImageUploaded: false,
    };
    expect(calculatePrice(order)).toBe(32.95);
  });

  it('should return the correct price for a sweater with white color', () => {
    const order = {
      productType: 'sweater',
      color: 'white',
      material: 'light',
      text: '',
      image: '',
      price: 0,
      currency: 'CAD',
      isImageUploaded: false,
    };
    expect(calculatePrice(order)).toBe(28.95);
  });

  // // Test case for invalid productType (if applicable)
  // it('should return 0 for an unknown product type', () => {
  //   const order = {
  //     productType: 'unknown',
  //     color: 'green',
  //     material: 'light',
  //     text: '',
  //     image: [],
  //   };
  //   expect(calculatePrice(order)).toBe(0);
  // });

  // // Test case for an empty order
  // it('should return 0 for an empty order object', () => {
  //   const order = {};
  //   expect(calculatePrice(order)).toBe(0);
  // });
});
