import axios from 'axios';
import { useState } from 'react';
import { FILE_SIZE, initialOrder } from '../constants';
import { calculatePrice } from '../helper/calculatePrice';
import { sendImageInChunks } from '../helper/sendImageInChunks';
import { Currency } from '../types/types';
import Toast from './Toast';

const Home = ({ currency }: { currency: Currency }) => {
  const [order, setOrder] = useState(initialOrder);
  const [filename, setFilename] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isEventListenerAdded, setIsEventListenerAdded] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', show: false });

  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    let newOrder = { ...order, [name]: value };
    const newPrice = calculatePrice({
      ...newOrder,
      ...(imagePreview ? { image: imagePreview } : {}),
    });
    if (name === 'productType') {
      setOrder(() => ({
        ...initialOrder,
        [name]: value,
      }));
    } else {
      setOrder((prevOrder) => ({
        ...prevOrder,
        [name]: value,
        price: newPrice,
      }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files && event.target?.files?.[0]?.size >= FILE_SIZE) {
      setToast({
        message: 'File size exceeds 2MB',
        type: 'error',
        show: true,
      });
      return;
    }
    const file = event?.target?.files?.[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        setImagePreview(e.target.result);
        let newOrder = { ...order, image: e.target.result };
        let newPrice = 0;
        if (!newOrder.isImageUploaded) {
          newPrice = calculatePrice(newOrder);
        }
        setOrder((prevOrder) => ({
          ...prevOrder,
          image: '',
          price: prevOrder.isImageUploaded ? prevOrder.price : newPrice,
          isImageUploaded: true,
        }));
        if (!isEventListenerAdded) {
          setIsEventListenerAdded(true);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setIsEventListenerAdded(false);
    }
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://0.0.0.0:9000/orders', order);
      if (imagePreview) {
        await sendImageInChunks(imagePreview!);
      }
      setToast({
        message: response.data.message,
        type: 'success',
        show: true,
      });
    } catch (error) {
      setToast({
        message: 'Failed to create order.',
        type: 'error',
        show: true,
      });
    }
    setOrder(initialOrder);
    setFilename('');
    setImagePreview(null);
    setIsEventListenerAdded(false);
  };

  return (
    <>
      <h1>T-Shirt Designer</h1>
      <form>
        {/* PRODUCT TYPE */}
        <div className="flex items-center mt-8">
          <label
            htmlFor="productType"
            className="block mb-2 text-sm font-medium"
          >
            Select product
          </label>
          <select
            id="productType"
            name="productType"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ml-6"
            onChange={handleChange}
            value={order.productType}
          >
            <option value="" disabled>
              Choose product
            </option>
            <option value="tshirt">T-Shirt</option>
            <option
              value="sweater"
              disabled={order.material === 'Heavy Cotton'}
            >
              Sweater
            </option>
          </select>
        </div>
        {/* MATERIAL */}
        {order.productType.length > 0 && (
          <div className="flex items-center mt-8">
            <label
              htmlFor="material"
              className="block mb-2 text-sm font-medium"
            >
              Select material
            </label>
            <select
              id="material"
              name="material"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ml-6"
              onChange={handleChange}
              value={order.material}
            >
              <option value="" disabled selected={order.material === ''}>
                Choose material
              </option>
              <option value="Light Cotton">Light Cotton</option>
              <option
                value="Heavy Cotton"
                disabled={order.productType === 'sweater'}
              >
                Heavy Cotton (+$3)
              </option>
            </select>
          </div>
        )}
        {/* COLOR */}
        {order.productType.length > 0 && order.material.length > 0 && (
          <div className="flex items-center mt-8">
            <label htmlFor="color" className="block mb-2 text-sm font-medium">
              Select color
            </label>
            <select
              id="color"
              name="color"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ml-11"
              onChange={handleChange}
              value={order.color}
            >
              <option value="" disabled>
                Choose color
              </option>
              <option value="white">White</option>
              <option value="black">Black</option>
              {order.productType === 'tshirt' && (
                <>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                </>
              )}
              {order.productType === 'sweater' && (
                <>
                  <option value="pink">Pink</option>
                  <option value="yellow">Yellow</option>
                </>
              )}
            </select>
          </div>
        )}
        {/* TEXT */}
        {order.productType === 'tshirt' &&
          order.material.length > 0 &&
          order.color.length > 0 && (
            <div className="flex items-center mt-8">
              <label htmlFor="text" className="block mb-2 text-sm font-medium">
                Type something <br /> to add to t-shirt
              </label>
              <input
                type="text"
                name="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-1/3 ml-4"
                placeholder="Type something to add to t-shirt"
                onChange={handleChange}
                maxLength={17}
              />
              {order.text.length > 16 && (
                <p className="mt-2 ml-2 text-sm text-red-600 dark:text-red-500">
                  <span className="font-medium">
                    Only 16 characters allowed
                  </span>
                </p>
              )}
            </div>
          )}
        {/* IMAGE UPLOAD */}
        {order.productType === 'tshirt' && (
          <div className="flex items-center mt-8">
            <label
              htmlFor="upload-section"
              className="block mb-2 text-sm font-medium"
            >
              Upload Image
            </label>
            <section className="w-1/3 items-center ml-9" id="upload-section">
              <div className=" bg-white rounded-lg shadow-md  items-center border border-black cursor-pointer">
                <div className="px-4 py-6">
                  <div
                    id="image-preview"
                    className={`${
                      !imagePreview
                        ? 'max-w-sm mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer'
                        : 'hidden'
                    }`}
                  >
                    <input
                      id="upload"
                      type="file"
                      className="hidden"
                      accept=".jpg, .jpeg, .png"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="upload" className="cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-8 h-8 text-gray-700 mx-auto mb-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                        Upload picture
                      </h5>
                      <p className="font-normal text-sm text-gray-400 md:px-6">
                        Choose photo in
                        <b className="text-gray-600">JPG, PNG</b> format.
                      </p>

                      <span
                        id="filename"
                        className="text-gray-500 bg-gray-200 z-50"
                      >
                        {filename}
                      </span>
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="max-h-48 rounded-lg mx-auto mb-4">
                      <img
                        src={imagePreview}
                        alt="Image preview"
                        className="w-full max-h-48 object-cover"
                        onClick={() => {
                          document.getElementById('upload')?.click();
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
        {/* CURRENCY */}
        {order.productType.length > 0 &&
          order.material.length > 0 &&
          order.color.length > 0 && (
            <div className="flex items-center mt-8">
              <label
                htmlFor="currency"
                className="block mb-2 text-sm font-medium"
              >
                Select currency
              </label>
              <select
                id="currency"
                name="currency"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ml-5"
                onChange={handleChange}
                value={order.currency}
              >
                {currency &&
                  Object.entries(currency).map(([key]) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
              </select>
            </div>
          )}
        {order.price != 0 && (
          <div className="flex items-center mt-8">
            <h3 className="mr-2">Price</h3>
            <h1 className="w-1/3 p-2.5 ml-20">{`${(
              order.price * (currency?.[order.currency] ?? 1)
            ).toFixed(2)} ${order.currency}`}</h1>
          </div>
        )}
        {/* SUBMIT */}
        {order.price != 0 && order.material.length > 0 && (
          <div className="flex items-center mt-8">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              onClick={handleSubmit}
            >
              Submit Order
            </button>
          </div>
        )}
        {/* TOAST NOTIFICATION */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </form>
    </>
  );
};

export default Home;
