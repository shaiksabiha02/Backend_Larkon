import pool from "../config/db.js";

try {
  await pool.query(`
    INSERT INTO inventory_received (
      received_id,
      purchase_order_id,
      supplier_name,
      warehouse_name,
      product_name,
      quantity,
      unit_price,
      total_amount,
      received_date,
      received_by,
      payment_status,
      status
    )
    VALUES

    ('RCV-001',11,'ABC Suppliers','Central Fulfillment','Wireless Mouse',120,15.50,1860.00,'2026-08-01','John Doe','Paid','Received'),

    ('RCV-002',12,'Tech World','East Coast Hub','Mechanical Keyboard',80,45.00,3600.00,'2026-08-02','Jane Smith','Paid','Received'),

    ('RCV-003',13,'Global Electronics','West Coast Depot','Gaming Monitor',40,180.00,7200.00,'2026-08-03','Richard Roe','Pending','Pending'),

    ('RCV-004',14,'Office Mart','Southern Distribution','Office Chair',60,95.00,5700.00,'2026-08-03','Alice Johnson','Paid','Received'),

    ('RCV-005',15,'Prime Traders','Northern Fulfillment','Laptop Stand',150,22.00,3300.00,'2026-08-04','Michael Brown','Paid','Received'),

    ('RCV-006',16,'Mega Supply','Midwest Center','USB Hub',200,12.50,2500.00,'2026-08-04','Emily Davis','Pending','Pending'),

    ('RCV-007',17,'Smart Devices','Southeast Storage','External SSD',70,85.00,5950.00,'2026-08-05','William Green','Paid','Received'),

    ('RCV-008',18,'IT Solutions','Northwest Hub','HD Webcam',90,48.00,4320.00,'2026-08-05','Jessica White','Paid','Received'),

    ('RCV-009',19,'Future Tech','Southwest Fulfillment','Bluetooth Speaker',110,38.00,4180.00,'2026-08-06','Christopher Black','Pending','Pending'),

    ('RCV-010',20,'NextGen Suppliers','Northeast Depot','Wireless Headset',95,72.00,6840.00,'2026-08-06','Patricia Clark','Paid','Received');
  `);

  console.log("Inventory Received data inserted successfully");
} catch (error) {
  console.error("Seeder Error:", error);
} finally {
  await pool.end();
}