import pool from "../config/db.js";

try {
  await pool.query(`
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
    VALUES

    ('RET-001',11,'ABC Suppliers','Central Fulfillment','Wireless Mouse',5,'Damaged Product','Approved',77.50,'2026-08-06'),

    ('RET-002',12,'Tech World','East Coast Hub','Mechanical Keyboard',3,'Wrong Item','Approved',135.00,'2026-08-07'),

    ('RET-003',13,'Global Electronics','West Coast Depot','Gaming Monitor',2,'Screen Damage','Pending',360.00,'2026-08-08'),

    ('RET-004',14,'Office Mart','Southern Distribution','Office Chair',4,'Broken Part','Approved',380.00,'2026-08-09'),

    ('RET-005',15,'Prime Traders','Northern Fulfillment','Laptop Stand',6,'Quality Issue','Approved',132.00,'2026-08-10'),

    ('RET-006',16,'Mega Supply','Midwest Center','USB Hub',10,'Defective','Pending',125.00,'2026-08-11'),

    ('RET-007',17,'Smart Devices','Southeast Storage','External SSD',2,'Not Working','Approved',170.00,'2026-08-12'),

    ('RET-008',18,'IT Solutions','Northwest Hub','HD Webcam',3,'Camera Fault','Approved',144.00,'2026-08-13'),

    ('RET-009',19,'Future Tech','Southwest Fulfillment','Bluetooth Speaker',4,'Audio Issue','Pending',152.00,'2026-08-14'),

    ('RET-010',20,'NextGen Suppliers','Northeast Depot','Wireless Headset',5,'Battery Issue','Approved',360.00,'2026-08-15');
  `);

  console.log("Purchase Returns data inserted successfully");
} catch (error) {
  console.error("Seeder Error:", error);
} finally {
  await pool.end();
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
    `INSERT INTO purchase_returns (
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
    RETURNING *`,
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