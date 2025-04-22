type Order = {
  id: number;
  productType: string;
  material: string;
  color: string;
  text: string;
  image: string;
  price: number;
  currency: string;
  isImageUploaded: boolean;
};

export const orders: Order[] = [];
