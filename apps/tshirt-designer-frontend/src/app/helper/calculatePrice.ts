import { Order } from '../types/types';

export const calculatePrice = (newOrder: Order) => {
  let basePrice = 0;
  if (newOrder.productType === 'tshirt') {
    if (newOrder.color === 'green' || newOrder.color === 'red') {
      basePrice = 18.95;
    } else if (newOrder.color === 'white' || newOrder.color === 'black') {
      basePrice = 16.95;
    }
    if (newOrder.material === 'heavy') {
      basePrice += 3;
    }
    if (newOrder?.text?.length > 8) {
      basePrice += 5;
    }
    if (newOrder.image.length > 0) {
      basePrice += 10;
    }
    if (newOrder.material === 'Heavy Cotton') {
      basePrice += 3;
    }
  } else if (newOrder.productType === 'sweater') {
    if (newOrder.color === 'pink' || newOrder.color === 'yellow') {
      basePrice = 32.95;
    } else if (newOrder.color === 'black' || newOrder.color === 'white') {
      basePrice = 28.95;
    }
  }
  return basePrice;
};
