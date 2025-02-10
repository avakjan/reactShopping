// src/components/CartPage.js
import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart, updateCartQuantities } from '../services/api';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch the cart when the component mounts.
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await getCart();
      setCartData(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Error fetching cart.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId, sizeId) => {
    try {
      await removeFromCart(itemId, sizeId);
      fetchCart(); // Refresh the cart after removal.
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Error removing item.');
    }
  };

  // Update the quantity in local state whenever the user modifies the input.
  const handleQuantityChange = (itemId, sizeId, newQuantity) => {
    const updatedCartData = { ...cartData };
    updatedCartData.cartItems = updatedCartData.cartItems.map((item) => {
      if (item.itemId === itemId && item.sizeId === sizeId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartData(updatedCartData);
  };

  // When the user clicks checkout, update the quantities on the server then navigate.
  const handleCheckout = async () => {
    try {
      await updateCartQuantities({ cartItems: cartData.cartItems });
      navigate("/checkout");
    } catch (err) {
      console.error('Error updating quantities:', err);
      setError('Error updating quantities.');
    }
  };

  // Compute the total cost of items in the cart.
  const computeTotal = () => {
    if (!cartData) return 0;
    return cartData.cartItems.reduce((sum, cartItem) => {
      const item = cartData.items.find(i => i.itemId === cartItem.itemId);
      return item ? sum + item.price * cartItem.quantity : sum;
    }, 0);
  };

  if (loading) return <div>Loading cart...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>Your Cart</h1>
      {cartData && cartData.cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Size</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartData.cartItems.map(cartItem => {
                const item = cartData.items.find(i => i.itemId === cartItem.itemId);
                const sizeObj = cartData.sizes && cartData.sizes.find(s => s.sizeId === cartItem.sizeId);
                const sizeName = sizeObj ? sizeObj.name : '';
                return (
                  <tr key={`${cartItem.itemId}-${cartItem.sizeId}`}>
                    <td>{item ? item.name : 'Unknown Item'}</td>
                    <td>{sizeName}</td>
                    <td>{item ? item.price.toFixed(2) : '0.00'}€</td>
                    <td>
                      <input 
                        type="number" 
                        min="1" 
                        value={cartItem.quantity} 
                        onChange={e =>
                          handleQuantityChange(
                            cartItem.itemId, 
                            cartItem.sizeId, 
                            parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </td>
                    <td>{item ? (item.price * cartItem.quantity).toFixed(2) : '0.00'}€</td>
                    <td>
                      <button onClick={() => handleRemove(cartItem.itemId, cartItem.sizeId)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="cart-summary">
            <h2>Total: {computeTotal().toFixed(2)}€</h2>
            {/* The Update Quantities button has been removed */}
            <button onClick={handleCheckout}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;