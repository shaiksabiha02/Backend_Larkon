import pool from "../config/db.js";

export async function getAllInventoryWarehouses() {
  const result = await pool.query(`
    SELECT
      iw.id,
      iw.warehouse_id,
      iw.warehouse_name,
      iw.location,
      iw.manager,
      iw.contact_number,
      iw.stock_available,
      iw.stock_shipping,
      iw.warehouse_revenue,
      iw.created_at,
      iw.updated_at
    FROM inventory_warehouse iw
    ORDER BY iw.id;
  `);

  return result.rows;
}

export async function getInventoryWarehouseById(id) {
  const result = await pool.query(
    `
    SELECT
      iw.id,
      iw.warehouse_id,
      iw.warehouse_name,
      iw.location,
      iw.manager,
      iw.contact_number,
      iw.stock_available,
      iw.stock_shipping,
      iw.warehouse_revenue,
      iw.created_at,
      iw.updated_at
    FROM inventory_warehouse iw
    WHERE iw.id = $1;
    `,
    [id]
  );

  return result.rows[0];
}

export async function createInventoryWarehouse(data) {
  const {
    warehouse_id,
    warehouse_name,
    location,
    manager,
    contact_number,
    stock_available,
    stock_shipping,
    warehouse_revenue
  } = data;

  const result = await pool.query(
    `
    INSERT INTO inventory_warehouse (
      warehouse_id,
      warehouse_name,
      location,
      manager,
      contact_number,
      stock_available,
      stock_shipping,
      warehouse_revenue
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING
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
      updated_at;
    `,
    [
      warehouse_id,
      warehouse_name,
      location,
      manager,
      contact_number,
      stock_available,
      stock_shipping,
      warehouse_revenue
    ]
  );

  return result.rows[0];
}
export async function updateInventoryWarehouse(id, data) {
  const {
    warehouse_id,
    warehouse_name,
    location,
    manager,
    contact_number,
    stock_available,
    stock_shipping,
    warehouse_revenue
  } = data;

  const result = await pool.query(
    `
    UPDATE inventory_warehouse
    SET
      warehouse_id = $1,
      warehouse_name = $2,
      location = $3,
      manager = $4,
      contact_number = $5,
      stock_available = $6,
      stock_shipping = $7,
      warehouse_revenue = $8,
      updated_at = NOW()
    WHERE id = $9
    RETURNING
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
      updated_at;
    `,
    [
      warehouse_id,
      warehouse_name,
      location,
      manager,
      contact_number,
      stock_available,
      stock_shipping,
      warehouse_revenue,
      id
    ]
  );

  return result.rows[0];
}