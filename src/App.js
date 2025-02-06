// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ItemsList from './components/ItemsList';
import ItemDetails from './components/ItemDetails';
import CartPage from './components/CartPage';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<ItemsList />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/cart" element={<CartPage />} />
        {/* Add a route for checkout if needed */}
      </Routes>
    </Router>
  );
}

export default App;