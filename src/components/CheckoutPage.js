// src/components/CheckoutPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CheckoutPage() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch the current checkout model from the GET endpoint
  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const response = await api.get('Cart/Checkout');
        setCheckoutData(response.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Error fetching checkout data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, []);

  // Handle changes for shipping details fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prevData) => ({
      ...prevData,
      shippingDetails: {
        ...prevData.shippingDetails,
        [name]: value,
      },
    }));
  };

  // When the user submits the form, post the updated checkout data
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('Cart/Checkout', checkoutData);
      // On success, navigate to an Order Confirmation page (or handle as needed)
      navigate(`/order-confirmation/${response.data.orderId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Order placement failed.');
    }
  };

  if (loading) return <div>Loading checkout...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Destructure the fields from the checkout model for convenience
  const { shippingDetails, paymentMethod, totalAmount } = checkoutData;

  return (
    <div>
      <h1>Checkout</h1>
      <form onSubmit={handlePlaceOrder}>
        <fieldset>
          <legend>Shipping Details</legend>
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={shippingDetails.fullName || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Address Line 1:</label>
            <input
              type="text"
              name="addressLine1"
              value={shippingDetails.addressLine1 || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Address Line 2:</label>
            <input
              type="text"
              name="addressLine2"
              value={shippingDetails.addressLine2 || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={shippingDetails.city || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>State:</label>
            <input
              type="text"
              name="state"
              value={shippingDetails.state || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Postal Code:</label>
            <input
              type="text"
              name="postalCode"
              value={shippingDetails.postalCode || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={shippingDetails.country || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={shippingDetails.phoneNumber || ''}
              onChange={handleInputChange}
              required
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Payment Information</legend>
          <div>
            <label>Payment Method:</label>
            {/* In this example, payment method is fixed.
                If you allow other methods, you can change this to a selectable field. */}
            <input type="text" name="paymentMethod" value={paymentMethod} readOnly />
          </div>
        </fieldset>

        <div>
          <strong>Total: {totalAmount} €</strong>
        </div>

        <button type="submit">Place Order</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default CheckoutPage;