const pool = require('../config/db');

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    const existing = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    );

    if (existing.rows.length) {
      await pool.query(
        'UPDATE cart SET quantity = quantity + $1 WHERE id = $2',
        [quantity || 1, existing.rows[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [userId, product_id, quantity || 1]
      );
    }

    res.json({ message: 'Product added to cart' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
         c.id AS cart_id,
         p.id AS product_id,
         p.name,
         p.price,
         p.material,
         p.weight,
         c.quantity,
         (p.price * c.quantity) AS total_price
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await pool.query(
      'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    res.json({ message: 'Product removed from cart' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
