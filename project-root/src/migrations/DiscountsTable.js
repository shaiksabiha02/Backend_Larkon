import pool from "../config/db.js";
async function createDiscountTable() {
    await pool.query(
        `
        Create table discounts(
        id serial primary key,
        product_id int not null unique,
        discount decimal(5,2) not null
        check(discount>=0),
        created_at TIMESTAMPTZ not null default current_timestamp,
        updated_at TIMESTAMPTZ not null default current_timestamp,
        constraint fk_discount_product
        foreign key (product_id)
        references products(id)
        on delete CASCADE);`
    );
    
    console.log("Discounts table created");
    process.exit();
}
createDiscountTable();