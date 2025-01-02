import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
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
      <h1>My React + .NET Shop</h1>
      <ul>
        {items.map(item => (
          <li key={item.itemId}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;