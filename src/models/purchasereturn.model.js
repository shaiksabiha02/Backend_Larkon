import pool from "../config/db.js";

export async function getAllPurchaseReturns() {
  const result = await pool.query(`
    SELECT
      pr.id,
      pr.return_id,
      pr.purchase_order_id,
      po.purchase_id,
      pr.supplier_name,
      pr.warehouse_name,
      pr.product_name,
      pr.quantity,
      pr.return_reason,
      pr.return_status,
      pr.refund_amount,
      pr.return_date,
      pr.created_at,
      pr.updated_at
    FROM purchase_returns pr
    LEFT JOIN purchase_orders po
      ON pr.purchase_order_id = po.id
    ORDER BY pr.id;
  `);

  return result.rows;
}

export async function getPurchaseReturnById(id) {
  const result = await pool.query(
    `
    SELECT
      pr.id,
      pr.return_id,
      pr.purchase_order_id,
      po.purchase_id,
      pr.supplier_name,
      pr.warehouse_name,
      pr.product_name,
      pr.quantity,
      pr.return_reason,
      pr.return_status,
      pr.refund_amount,
      pr.return_date,
      pr.created_at,
      pr.updated_at
    FROM purchase_returns pr
    LEFT JOIN purchase_orders po
      ON pr.purchase_order_id = po.id
    WHERE pr.id = $1;
    `,
    [id]
  );

  return result.rows[0];
}

export async function createPurchaseReturn(data) {
  const {
    return_id,
    purchase_order_id,
    supplier_name,
    warehouse_name,
    product_name,
    quantity,
    return_reason,
    return_status,
    refund_amount,
    return_date
  } = data;

  const result = await pool.query(
    `
    INSERT INTO purchase_returns (
      return_id,
      purchase_order_id,
      supplier_name,
      warehouse_name,
      product_name,
      quantity,
      return_reason,
      return_status,
      refund_amount,
      return_date
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
    `,
    [
      return_id,
      purchase_order_id,
      supplier_name,
      warehouse_name,
      product_name,
      quantity,
      return_reason,
      return_status,
      refund_amount,
      return_date
    ]
  );

  return result.rows[0];
}