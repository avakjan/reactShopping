import '../App.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:5079/api/items')
      .then(response => {
        // If your API returns { items: [...], categories: [...], ... }
        console.log('API response:', response.data);
        // Let's just assume it has an "items" array
        setItems(response.data.items);
      })
      .catch(error => {
        console.error('API error:', error);
      });
  }, []);

  return (
    <div>
      <h1>All Items</h1>
      <ul>
        {items.map(item => (
          <li key={item.itemId}>
            {/* Link to /items/1 or /items/2, etc. */}
            <Link to={`/items/${item.itemId}`}>
              <img src={item.imageUrl} alt={item.name} width="80" />
              {item.name} - ${item.price}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;