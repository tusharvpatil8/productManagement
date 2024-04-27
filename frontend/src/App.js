import React from 'react';
import { BrowserRouter as Router, Switch, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import AddEditProduct from './components/AddEditProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<ProductList />} />
        <Route exact path="/add-product" element={<AddEditProduct />} />
        <Route exact path="/edit-product/:productId" element={<AddEditProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
