import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function AddEditProduct() {
  const { productId } = useParams();
  const [product, setProduct] = useState({
    encrypted_sku: '',
    product_name: '',
    category: '',
    material: '',
    status: ''
  });

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (id) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (productId) {
        await axios.put(`/api/products/${productId}`, product);
      } else {
        await axios.post('/api/products', product);
      }
      // Redirect or show success message
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div>
      <h2>{productId ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>SKU:</label>
          <input type="text" name="encrypted_sku" value={product.encrypted_sku} onChange={handleChange} />
        </div>
        <div>
          <label>Product Name:</label>
          <input type="text" name="product_name" value={product.product_name} onChange={handleChange} />
        </div>
        <div>
          <label>Category:</label>
          <input type="text" name="category" value={product.category} onChange={handleChange} />
        </div>
        <div>
          <label>Material:</label>
          <input type="text" name="material" value={product.material} onChange={handleChange} />
        </div>
        <div>
          <label>Status:</label>
          <input type="text" name="status" value={product.status} onChange={handleChange} />
        </div>
        <button type="submit">{productId ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
}

export default AddEditProduct;
