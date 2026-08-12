import pool from "../config/db.js";
async function createReviewTable() {
    await pool.query(
        `
        Create table reviews(
        id serial primary key,
        product_id int not null,
        user_id int not null,
        order_item_id int not null unique,
        rating int not null
        check(rating between 1 and 5),
        review_title varchar(100),
        review text not null,
        status varchar(20) not null default 'pending'
        check(status IN ('pending','approved','rejected','hidden')),
        created_at TIMESTAMPTZ not null default current_timestamp,
        updated_at TIMESTAMPTZ not null default current_timestamp,
        constraint fk_review_products
        foreign key(product_id)
        references products(id)
        on delete CASCADE,

        constraint fk_review_order_item
        foreign key (order_item_id)
        references order_items(id)
        on delete CASCADE
        );
        `
    );
    
    console.log("Review table created");
    process.exit();
}
createReviewTable();