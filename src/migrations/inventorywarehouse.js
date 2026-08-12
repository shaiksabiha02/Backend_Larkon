import pool from "../config/db.js";

export async function getAllInventoryWarehouses() {
  const result = await pool.query(`
    SELECT
      id,
      warehouse_id,
      warehouse_name,
      location,
      manager,
      contact_number,
      stock_available,
      stock_shipping,
      warehouse_revenue,
      created_at,
      updated_at
    FROM inventory_warehouse
    ORDER BY id;
  `);

  return result.rows;
}

export async function getInventoryWarehouseById(id) {
  const result = await pool.query(`
    SELECT
      id,
      warehouse_id,
      warehouse_name,
      location,
      manager,
      contact_number,
      stock_available,
      stock_shipping,
      warehouse_revenue,
      created_at,
      updated_at
    FROM inventory_warehouse
    WHERE id = $1;
  `, [id]);

  return result.rows[0];
}