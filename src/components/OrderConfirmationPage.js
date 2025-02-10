// src/components/OrderConfirmationPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function OrderConfirmationPage() {
  const { id } = useParams(); // Extract the order ID from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/Account/OrderConfirmation/${id}`);
        setOrder(response.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Error fetching order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div>Loading order details...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Order Confirmation</h1>
      <h2>Order ID: {order.orderId}</h2>
      <section>
        <h3>Shipping Details</h3>
        <p><strong>Name:</strong> {order.shippingDetails.fullName}</p>
        <p>
          <strong>Address:</strong> {order.shippingDetails.addressLine1}{' '}
          {order.shippingDetails.addressLine2 && order.shippingDetails.addressLine2}
        </p>
        <p>
          <strong>City:</strong> {order.shippingDetails.city} | <strong>State:</strong> {order.shippingDetails.state}
        </p>
        <p>
          <strong>Postal Code:</strong> {order.shippingDetails.postalCode} | <strong>Country:</strong> {order.shippingDetails.country}
        </p>
        <p><strong>Phone:</strong> {order.shippingDetails.phoneNumber}</p>
      </section>

      <section>
        <h3>Order Items</h3>
        <ul>
          {order.orderItems.map((item) => (
            <li key={item.orderItemId}>
              <p><strong>Item:</strong> {item.item.name}</p>
              <p><strong>Size:</strong> {item.size ? item.size.name : 'N/A'}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Unit Price:</strong> {item.unitPrice} €</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Summary</h3>
        <p><strong>Total Amount:</strong> {order.totalAmount} €</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Status:</strong> {order.status}</p>
      </section>
    </div>
  );
}

export default OrderConfirmationPage;