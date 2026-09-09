// This component simulate a checkout feature by clearing the cart and displaying a success message.
// It uses Redux to manage the cart state and React-Bootstrap for styling.

import { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { clearCart } from '../store/cartSlice';

const CheckOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    dispatch(clearCart());      // Clear the cart items in the Redux store
    setIsSuccess(true);

    setTimeout(() => {
      navigate('/products');    // Navigate to the products page after 2 seconds
    }, 2000);
  };

  return (
    <div className="text-center mt-5 px-3">
      {!isSuccess ? (
        <>
          <Button variant="success" size="lg" onClick={handleCheckout} disabled={cartItems.length === 0}>
            Continue to checkout
          </Button>
          {cartItems.length === 0 && (
            <p className="mt-3 text-muted">Your cart is empty.</p>
          )}
        </>
      ) : (
        <Alert variant="success" className="mx-auto" style={{ maxWidth: '600px' }}>
          <h4 className="mb-2">Thank you for your purchase!</h4>
          <p className="mb-0">Your order has been successfully placed, and your cart has been cleared.</p>
        </Alert>
      )}
    </div>
  );
};

export default CheckOut;