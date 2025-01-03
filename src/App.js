// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ItemList from './components/ItemList';
import ItemDetails from './components/ItemDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ItemList />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        {/* Add the Cart route */}
        <Route path="/cart" element={<Cart />} />
        {/* Add a simple Checkout route */}
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;