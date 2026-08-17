import pool from "../config/db.js";

export async function getAllPurchaseLists() {
  const result = await pool.query(`
    SELECT
      pl.id,
      pl.purchase_order_id,
      po.purchase_id,
      pl.supplier_name,
      pl.product_name,
      pl.category,
      pl.quantity,
      pl.unit_price,
      pl.total_amount,
      pl.purchase_date,
      pl.status,
      pl.created_at,
      pl.updated_at
    FROM purchase_list pl
    LEFT JOIN purchase_orders po
      ON pl.purchase_order_id = po.id
    ORDER BY pl.id;
  `);

  return result.rows;
}

export async function getPurchaseListById(id) {
  const result = await pool.query(`
    SELECT
      pl.id,
      pl.purchase_order_id,
      po.purchase_id,
      pl.supplier_name,
      pl.product_name,
      pl.category,
      pl.quantity,
      pl.unit_price,
      pl.total_amount,
      pl.purchase_date,
      pl.status,
      pl.created_at,
      pl.updated_at
    FROM purchase_list pl
    LEFT JOIN purchase_orders po
      ON pl.purchase_order_id = po.id
    WHERE pl.id = $1;
  `, [id]);

  return result.rows[0];
}