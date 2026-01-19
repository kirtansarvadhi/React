const pool = require('../config/db');

exports.placeOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.id;

    await client.query('BEGIN');

    const cartResult = await client.query(
      `SELECT c.product_id, c.quantity, p.price, p.stock
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );

    if (!cartResult.rows.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalPrice = 0;

    for (const item of cartResult.rows) {
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          message: `Insufficient stock for product ${item.product_id}`
        });
      }
      totalPrice += item.price * item.quantity;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_price)
       VALUES ($1, $2)
       RETURNING id`,
      [userId, totalPrice]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );

      await client.query(
        `UPDATE products
         SET stock = stock - $1
         WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query(
      'DELETE FROM cart WHERE user_id = $1',
      [userId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Order placed successfully',
      orderId,
      totalPrice
    });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(orders.rows);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
