const pool = require('../config/db');
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      jewelry_type,
      material,
      weight,
      purity,
      price,
      stock,
      description
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products
      (name, jewelry_type, material, weight, purity, price, stock, description)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [name, jewelry_type, material, weight, purity, price, stock, description]
    );

    res.status(201).json({
      message: 'Product created',
      product: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE products
       SET name=$1, jewelry_type=$2, material=$3, weight=$4,
           purity=$5, price=$6, stock=$7, description=$8
       WHERE id=$9 RETURNING *`,
      [
        req.body.name,
        req.body.jewelry_type,
        req.body.material,
        req.body.weight,
        req.body.purity,
        req.body.price,
        req.body.stock,
        req.body.description,
        id
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated',
      product: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
