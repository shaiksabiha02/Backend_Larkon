import Pool from "../config/db.js";
async function createcart_itemsTable() {
    await Pool.query(`
                
        CREATE TABLE IF NOT EXISTS cart_items (
                id SERIAL PRIMARY KEY,
                cart_id INT NOT NULL,
                items_id INT NOT NULL,
                quantity INT  DEFAULT 1,
                CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
                CONSTRAINT fk_cart_items_products FOREIGN KEY (items_id) REFERENCES products(id) ON DELETE CASCADE
            );  
    `);
    console.log("Cart_items table created successfully.");
    process.exit();
}
 createcart_itemsTable();


 