import Pool from "../config/db.js";
async function createOrderItemsTable() {
    await Pool.query(`
    
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10,2) DEFAULT 0.00,
    category_id INT ,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_products FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_categories FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );


    `);
    console.log("Order_items table created DE successfully.");
    process.exit();
}
 createOrderItemsTable();

