// src/components/Cart.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Example: fetch cart from your .NET endpoint: /api/cart
    // Or replace with localStorage / Context usage if you store cart differently.
    axios.get('http://localhost:5079/api/cart') // Adjust the URL to match your API
      .then(response => {
        // Assume response.data is an array of cart items
        setCart(response.data);
      })
      .catch(err => {
        console.error('Error fetching cart:', err);
      });
  }, []);

  // Calculate total items, total price, etc.
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Navigate to the checkout page
  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((cartItem) => (
                <tr key={`${cartItem.itemId}-${cartItem.sizeId}`}>
                  <td>{cartItem.name}</td>
                  <td>{cartItem.sizeName}</td>
                  <td>{cartItem.quantity}</td>
                  <td>${(cartItem.price * cartItem.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />
          <p>Total items: {totalQuantity}</p>
          <p>Total price: ${totalPrice.toFixed(2)}</p>

          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </>
      )}

      <div style={{ marginTop: '20px' }}>
        <Link to="/">Back to Items</Link>
      </div>
    </div>
  );
}

export default Cart;