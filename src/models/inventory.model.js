import pool from "../config/db.js";

export async function getAllInventory() {
  const result = await pool.query(`
    SELECT
      id,
      product_id,
      product_name,
      stock_quantity,
      low_stock_threshold,
      created_at,
      updated_at
    FROM inventory
    ORDER BY id;
  `);

  return result.rows;
}

export async function getInventoryByProductId(productId) {
  const result = await pool.query(
    `
    SELECT
      id,
      product_id,
      product_name,
      stock_quantity,
      low_stock_threshold,
      created_at,
      updated_at
    FROM inventory
    WHERE product_id = $1;
    `,
    [productId]
  );

  return result.rows[0];
}

export async function adjustInventory(productId, quantity) {
  const result = await pool.query(
    `
    UPDATE inventory
    SET
      stock_quantity = stock_quantity + $1,
      updated_at = NOW()
    WHERE product_id = $2
    RETURNING *;
    `,
    [quantity, productId]
  );

  return result.rows[0];
}

export async function getLowStockInventory() {
  const result = await pool.query(`
    SELECT
      id,
      product_id,
      product_name,
      stock_quantity,
      low_stock_threshold,
      created_at,
      updated_at
    FROM inventory
    WHERE stock_quantity <= low_stock_threshold
    ORDER BY stock_quantity ASC;
  `);

  return result.rows;
}