import pool from "../config/db.js";

export async function getAllInventoryReceived() {
  const result = await pool.query(`
    SELECT
      ir.id,
      ir.received_id,
      ir.purchase_order_id,
      po.purchase_id,
      ir.supplier_name,
      ir.warehouse_name,
      ir.product_name,
      ir.quantity,
      ir.unit_price,
      ir.total_amount,
      ir.received_date,
      ir.received_by,
      ir.payment_status,
      ir.status,
      ir.created_at,
      ir.updated_at
    FROM inventory_received ir
    LEFT JOIN purchase_orders po
      ON ir.purchase_order_id = po.id
    ORDER BY ir.id;
  `);

  return result.rows;
}

export async function getInventoryReceivedById(id) {
  const result = await pool.query(`
    SELECT
      ir.id,
      ir.received_id,
      ir.purchase_order_id,
      po.purchase_id,
      ir.supplier_name,
      ir.warehouse_name,
      ir.product_name,
      ir.quantity,
      ir.unit_price,
      ir.total_amount,
      ir.received_date,
      ir.received_by,
      ir.payment_status,
      ir.status,
      ir.created_at,
      ir.updated_at
    FROM inventory_received ir
    LEFT JOIN purchase_orders po
      ON ir.purchase_order_id = po.id
    WHERE ir.id = $1;
  `, [id]);

  return result.rows[0];
}