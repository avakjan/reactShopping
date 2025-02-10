// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ItemsList from './components/ItemsList';
import ItemDetails from './components/ItemDetails';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<ItemsList />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
      </Routes>
    </Router>
  );
}

export default App;