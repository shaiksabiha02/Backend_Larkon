import pool from "../config/db.js";

try {
  await pool.query(`
    INSERT INTO purchase_list (
      purchase_order_id,
      supplier_name,
      product_name,
      category,
      quantity,
      unit_price,
      total_amount,
      purchase_date,
      status
    )
    VALUES
      (11,'ABC Suppliers','Wireless Mouse','Accessories',120,15.50,1860.00,'2026-08-01','Completed'),

      (12,'Tech World','Mechanical Keyboard','Accessories',80,45.00,3600.00,'2026-08-02','Completed'),

      (13,'Global Electronics','Gaming Monitor','Monitors',40,180.00,7200.00,'2026-08-03','Pending'),

      (14,'Office Mart','Office Chair','Furniture',60,95.00,5700.00,'2026-08-04','Completed'),

      (15,'Prime Traders','Laptop Stand','Accessories',150,22.00,3300.00,'2026-08-05','Completed'),

      (16,'Mega Supply','USB Hub','Accessories',200,12.50,2500.00,'2026-08-06','Pending'),

      (17,'Smart Devices','External SSD','Storage',70,85.00,5950.00,'2026-08-07','Completed'),

      (18,'IT Solutions','HD Webcam','Accessories',90,48.00,4320.00,'2026-08-08','Completed'),

      (19,'Future Tech','Bluetooth Speaker','Audio',110,38.00,4180.00,'2026-08-09','Pending'),

      (20,'NextGen Suppliers','Wireless Headset','Audio',95,72.00,6840.00,'2026-08-10','Completed');
  `);

  console.log("Purchase List data inserted successfully");
} catch (error) {
  console.error("Seeder Error:", error);
} finally {
  await pool.end();
}