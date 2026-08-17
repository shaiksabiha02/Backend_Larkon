import pool from "../config/db.js";

try {
  await pool.query(`
    INSERT INTO inventory_warehouse
    (
      warehouse_id,
      warehouse_name,
      location,
      manager,
      contact_number,
      stock_available,
      stock_shipping,
      warehouse_revenue
    )
    VALUES
    ('WH-001','Central Fulfillment','123 Commerce St, NY','John Doe','+1 (555) 123-4567',6490,3022,25737.00),

    ('WH-002','East Coast Hub','456 Market Ave, NY','Jane Smith','+1 (555) 234-5678',7362,4253,67351.00),

    ('WH-003','West Coast Depot','789 Trade Blvd, CA','Richard Roe','+1 (555) 345-6789',8842,3221,45865.00),

    ('WH-004','Southern Distribution','101 Supply Rd, TX','Alice Johnson','+1 (555) 456-7890',5463,2100,54655.00),

    ('WH-005','Northern Fulfillment','202 Logistics Ln, IL','Michael Brown','+1 (555) 567-8901',12643,7008,92533.00),

    ('WH-006','Midwest Center','303 Central St, MO','Emily Davis','+1 (555) 678-9012',7553,5600,43898.00),

    ('WH-007','Southeast Storage','404 Storage Dr, FL','William Green','+1 (555) 789-0123',9381,5343,76909.00),

    ('WH-008','Northwest Hub','505 Commerce Pl, WA','Jessica White','+1 (555) 890-1234',6500,3453,32765.00),

    ('WH-009','Southwest Fulfillment','606 Trade Ave, AZ','Christopher Black','+1 (555) 901-2345',7555,9000,67565.00),

    ('WH-010','Northeast Depot','707 Distribution Rd, MA','Patricia Clark','+1 (555) 012-3456',5499,3433,43765.00);
  `);

  console.log("Inventory Warehouse data inserted successfully");
} catch (error) {
  console.error("Seeder Error:", error);
} finally {
  await pool.end();
}