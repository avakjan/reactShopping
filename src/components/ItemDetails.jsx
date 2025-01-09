import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ItemDetails() {
  const { id } = useParams(); // gets the :id from the URL
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSizeId, setSelectedSizeId] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios.get(`https://localhost:5079/api/items/${id}`)
      .then(response => {
        setItem(response.data);
        setLoading(false);
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSizeId(response.data.sizes[0].sizeId);
        }
      })
      .catch(err => {
        console.error(err);
        setError('Could not fetch item details');
        setLoading(false);
      });
  }, [id]);  

  const handleSizeChange = (e) => {
    setSelectedSizeId(e.target.value);
  };

  // Handle changing quantity
  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setQuantity(val > 0 ? val : 1); // ensure at least 1
  };

  // POST to the addToCart endpoint
  const handleAddToCart = () => {
    // Ensure user selected a size, if required
    if (!selectedSizeId) {
      alert('Please select a size.');
      return;
    }
  
    const payload = {
      itemId: item.itemId,
      sizeId: parseInt(selectedSizeId, 10),  // Ensure it's an integer
      quantity
    };
  
    axios.post('https://localhost:5079/api/items/addToCart', payload)
      .then(response => {
        alert(response.data.message || 'Item added to cart!');
      })
      .catch(err => {
        console.error('Add to cart error:', err);
        if (err.response && err.response.data && err.response.data.Error) {
          alert(err.response.data.Error);
        } else {
          alert('An error occurred while adding to cart.');
        }
      });
  };

  // Navigate to /cart
  const handleViewCart = () => {
    navigate('/cart');
  };

  if (loading) return <div>Loading item details...</div>;
  if (error) return <div>{error}</div>;

  // Make sure item is not null before accessing properties
  if (!item) {
    return <div>No item found</div>;
  }

  return (
    <div>
      <h2>Item Details</h2>
      <p><strong>ID:</strong> {item.itemId}</p>
      <p><strong>Name:</strong> {item.name}</p>
      <p> <img src={item.imageUrl} alt={item.name} /></p>
      <p><strong>Price:</strong> ${item.price}</p>
      <p><strong>Description:</strong> {item.description}</p>

      {/* If your API returns an array of sizes, let's assume it's item.sizes */}
      {item.sizes && item.sizes.length > 0 && (
        <div>
          <label htmlFor="sizeSelect"><strong>Size:</strong></label>
          <select
            id="sizeSelect"
            value={selectedSizeId}
            onChange={(e) => setSelectedSizeId(e.target.value)}
          >
            {item.sizes.map((sz) => (
              <option key={sz.sizeId} value={sz.sizeId}>
                {sz.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <label htmlFor="quantityInput"><strong>Quantity:</strong></label>
        <input
          id="quantityInput"
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          style={{ width: '60px', marginLeft: '5px' }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleAddToCart}>Add to Cart</button>
        <button onClick={handleViewCart} style={{ marginLeft: '10px' }}>
          View Cart
        </button>
      </div>
    </div>
  );
}

export default ItemDetails;