import pool from "../config/db.js";

export async function getAllPurchaseOrders() {
  const result = await pool.query(`
    SELECT
      po.id,
      po.purchase_id,
      po.supplier_name,
      po.warehouse_name,
      po.product_id,
      p.product_name,
      po.quantity,
      po.unit_price,
      po.total_amount,
      po.purchase_status,
      po.payment_method,
      po.payment_status,
      po.order_date,
      po.expected_delivery,
      po.created_at,
      po.updated_at
    FROM purchase_orders po
    LEFT JOIN products p
      ON po.product_id = p.id
    ORDER BY po.id;
  `);

  return result.rows;
}

export async function getPurchaseOrderById(id) {
  const result = await pool.query(
    `
    SELECT
      po.id,
      po.purchase_id,
      po.supplier_name,
      po.warehouse_name,
      po.product_id,
      p.product_name,
      po.quantity,
      po.unit_price,
      po.total_amount,
      po.purchase_status,
      po.payment_method,
      po.payment_status,
      po.order_date,
      po.expected_delivery,
      po.created_at,
      po.updated_at
    FROM purchase_orders po
    LEFT JOIN products p
      ON po.product_id = p.id
    WHERE po.id = $1;
    `,
    [id]
  );

  return result.rows[0];
}

export async function createPurchaseOrder(data) {
  const {
    purchase_id,
    supplier_name,
    warehouse_name,
    product_id,
    quantity,
    unit_price,
    total_amount,
    purchase_status,
    payment_method,
    payment_status,
    order_date,
    expected_delivery
  } = data;

  const result = await pool.query(
    `
    INSERT INTO purchase_orders (
      purchase_id,
      supplier_name,
      warehouse_name,
      product_id,
      quantity,
      unit_price,
      total_amount,
      purchase_status,
      payment_method,
      payment_status,
      order_date,
      expected_delivery
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
    `,
    [
      purchase_id,
      supplier_name,
      warehouse_name,
      product_id,
      quantity,
      unit_price,
      total_amount,
      purchase_status,
      payment_method,
      payment_status,
      order_date,
      expected_delivery
    ]
  );

  return result.rows[0];
}