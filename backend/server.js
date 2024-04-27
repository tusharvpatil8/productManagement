const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');

const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

const app = express();
const PORT = process.env.PORT || 5000;
app.options("*", cors())


app.use(bodyParser.json());
app.use(cors(corsOptions));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'productdata',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// API Routes
app.get('/api/products', async (req, res) => {
  console.log('called');
  try {
    const { page, pageSize, sku, productName, category, material, status } = req.query;
    const offset = (page - 1) * pageSize || 0;
    const limit = pageSize || 10;
    let whereClause = '';
    if (sku) whereClause += ` AND encrypted_sku LIKE '%${sku}%'`;
    if (productName) whereClause += ` AND product_name LIKE '%${productName}%'`;
    if (category) whereClause += ` AND category LIKE '%${category}%'`;
    if (material) whereClause += ` AND material LIKE '%${material}%'`;
    if (status) whereClause += ` AND status = '${status}'`;
    const query = `SELECT * FROM products WHERE 1 ${whereClause} LIMIT ${limit} OFFSET ${offset}`;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { encrypted_sku, product_name, category, material, status } = req.body;
    const query = `INSERT INTO products (encrypted_sku, product_name, category, material, status) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.query(query, [encrypted_sku, product_name, category, material, status]);
    res.json({ id: result.insertId });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { encrypted_sku, product_name, category, material, status } = req.body;
    const query = `UPDATE products SET encrypted_sku=?, product_name=?, category=?, material=?, status=? WHERE id=?`;
    await pool.query(query, [encrypted_sku, product_name, category, material, status, productId]);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const query = `DELETE FROM products WHERE id=?`;
    await pool.query(query, [productId]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
