export type Order = {
  id?: number;
  productType: string;
  material: string;
  color: string;
  text: string;
  image: string;
  price: number;
  currency: string;
  isImageUploaded: boolean;
};

export type Currency = {
  [key: string]: number;
};

export type ToastProps = {
  message: string;
  type: string;
  onClose: () => void;
};
