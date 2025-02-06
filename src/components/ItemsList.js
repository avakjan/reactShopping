// src/components/ItemsList.js
import React, { useEffect, useState } from 'react';
import { getItems } from '../services/api';
import { useNavigate } from 'react-router-dom';

function ItemsList() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchItems = async (categoryId = 0) => {
    setLoading(true);
    try {
      const response = await getItems(categoryId);
      setItems(response.data.items);
      setCategories(response.data.categories);
      setSelectedCategory(response.data.selectedCategoryId);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value, 10);
    setSelectedCategory(categoryId);
    fetchItems(categoryId);
  };

  const handleItemClick = (id) => {
    navigate(`/item/${id}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="filter">
        <label htmlFor="category-select">Filter by Category: </label>
        <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
          <option value={0}>All Categories</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.itemId} className="item-card" onClick={() => handleItemClick(item.itemId)}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemsList;