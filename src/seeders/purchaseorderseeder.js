import pool from "../config/db.js";

try {
  await pool.query(`
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
    VALUES

    ('PO-001','ABC Suppliers','Central Fulfillment',5,120,15.50,1860.00,'Completed','Credit Card','Paid','2026-08-01','2026-08-05'),

    ('PO-002','Tech World','East Coast Hub',6,80,45.00,3600.00,'Completed','Bank Transfer','Paid','2026-08-02','2026-08-06'),

    ('PO-003','Global Electronics','West Coast Depot',7,40,180.00,7200.00,'Pending','UPI','Pending','2026-08-03','2026-08-08'),

    ('PO-004','Office Mart','Southern Distribution',8,60,95.00,5700.00,'Completed','Cash','Paid','2026-08-04','2026-08-09'),

    ('PO-005','Prime Traders','Northern Fulfillment',9,150,22.00,3300.00,'Completed','Credit Card','Paid','2026-08-05','2026-08-10'),

    ('PO-006','Mega Supply','Midwest Center',10,200,12.50,2500.00,'Pending','Bank Transfer','Pending','2026-08-06','2026-08-11'),

    ('PO-007','Smart Devices','Southeast Storage',11,70,85.00,5950.00,'Completed','UPI','Paid','2026-08-07','2026-08-12'),

    ('PO-008','IT Solutions','Northwest Hub',12,90,48.00,4320.00,'Completed','Credit Card','Paid','2026-08-08','2026-08-13'),

    ('PO-009','Future Tech','Southwest Fulfillment',13,110,38.00,4180.00,'Pending','Cash','Pending','2026-08-09','2026-08-14'),

    ('PO-010','NextGen Suppliers','Northeast Depot',14,95,72.00,6840.00,'Completed','Credit Card','Paid','2026-08-10','2026-08-15');
  `);

  console.log("Purchase Orders data inserted successfully");
} catch (error) {
  console.error("Seeder Error:", error);
} finally {
  await pool.end();
}