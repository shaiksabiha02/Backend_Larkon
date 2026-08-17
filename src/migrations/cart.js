import Pool from "../config/db.js";
async function createcartTable() {
    await Pool.query(`
     CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
    `);
    console.log("Cart table created successfully.");
    process.exit();
}
 createcartTable();
   



