// src/components/ItemDetails.js
import React, { useEffect, useState } from 'react';
import { getItemDetails, addToCart } from '../services/api';
import { useParams } from 'react-router-dom';

function ItemDetails() {
  const { id } = useParams();
  const [itemDetails, setItemDetails] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getItemDetails(id);
        setItemDetails(response.data.item);
        // If available, select the first available size by default
        if (response.data.item.itemSizes && response.data.item.itemSizes.length > 0) {
          setSelectedSize(response.data.item.itemSizes[0].size.sizeId);
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setMessage('Please select a size.');
      return;
    }
    try {
      const response = await addToCart(itemDetails.itemId, selectedSize, quantity);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage('Error adding item to cart.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!itemDetails) return <div>Item not found.</div>;

  return (
    <div className="container">
      <h1>{itemDetails.name}</h1>
      <p>{itemDetails.description}</p>
      <p>Price: ${itemDetails.price}</p>

      <div className="size-selection">
        <label>Size:</label>
        {itemDetails.itemSizes.map((itemSize) => (
          <label key={itemSize.size.sizeId} style={{ marginRight: '1rem' }}>
            <input
              type="radio"
              name="size"
              value={itemSize.size.sizeId}
              checked={selectedSize === itemSize.size.sizeId}
              onChange={() => setSelectedSize(itemSize.size.sizeId)}
            />
            {itemSize.size.name}
          </label>
        ))}
      </div>

      <div className="quantity-selection">
        <label>Quantity: </label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          style={{ width: '60px' }}
        />
      </div>

      <button onClick={handleAddToCart}>Add to Cart</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ItemDetails;