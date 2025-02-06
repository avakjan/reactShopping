// src/components/CartPage.js
import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart, updateCartQuantities } from '../services/api';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // The cartData object is expected to have the following structure:
  // {
  //   cartItems: [ { itemId, sizeId, quantity }, ... ],
  //   items: [ { itemId, name, price, ... }, ... ],
  //   sizes: [ { sizeId, name, ... }, ... ]
  // }
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

  const handleQuantityChange = (itemId, sizeId, newQuantity) => {
    // Update the cartData state locally to reflect the changed quantity.
    const updatedCartData = { ...cartData };
    updatedCartData.cartItems = updatedCartData.cartItems.map((item) => {
      if (item.itemId === itemId && item.sizeId === sizeId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartData(updatedCartData);
  };

  const handleUpdateQuantities = async () => {
    try {
      // The update endpoint expects a CartViewModel containing the CartItems array.
      await updateCartQuantities({ cartItems: cartData.cartItems });
      fetchCart();
    } catch (err) {
      console.error('Error updating quantities:', err);
      setError('Error updating quantities.');
    }
  };

  const computeTotal = () => {
    if (!cartData) return 0;
    // Sum up price * quantity for each cart item.
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
                // Find the corresponding item details:
                const item = cartData.items.find(i => i.itemId === cartItem.itemId);
                // Find the corresponding size name:
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
            <button onClick={handleUpdateQuantities}>Update Quantities</button>
            <button onClick={() => navigate("/checkout")}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;