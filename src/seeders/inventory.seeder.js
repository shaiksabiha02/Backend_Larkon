import pool from "../config/db.js";

try {
  await pool.query(`
    INSERT INTO inventory (
      product_id,
      product_name,
      stock_quantity,
      low_stock_threshold
    )
    VALUES
      (5, 'Black T-shirt', 120, 20),
      (6, 'Olive Green Leather Bag', 80, 15),
      (7, 'Women Gold Dress', 40, 10),
      (8, 'Gray Cap For Men', 60, 10),
      (9, 'Dark Green Cargo Pant', 150, 20),
      (10, 'Updated Test Shirt', 200, 25),
      (11, 'Kid''s Yellow Shoes', 70, 15),
      (12, 'Men Dark Brown Wallet', 90, 15),
      (13, 'Sky Blue Sunglass', 110, 20),
      (14, 'Kid''s Yellow T-shirt', 95, 20);
  `);

  console.log("Inventory data inserted successfully");
} catch (error) {
  console.error("Inventory Seeder Error:", error);
} finally {
  await pool.end();
}