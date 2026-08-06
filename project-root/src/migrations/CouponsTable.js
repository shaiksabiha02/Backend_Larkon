import pool from "../config/db.js";
async function createCouponsTable() {
    await pool.query(
        `
        Create table coupons(
        id serial primary key,
        coupon_code varchar(50) not null unique,
        
        country varchar(100),
        coupon_type varchar(20) not null
        check(coupon_type IN ('free_shipping','percentage','fixed_amount')),
        discount_value DECIMAL(10,2) not null
        check(discount_value >=0),
        minimum_order_amount decimal(10,2) not null default 0,
        maximum_discount_amount decimal(10,2),
        usage_limit int not null
        check(usage_limit>0),
        used_count int not null default 0,
        status varchar(20) not null default 'Active'
        check(status IN ('Active','In Active','future Plan')),
        start_date TIMESTAMPTZ Not null,
        end_date TIMESTAMPTZ not null
        check(end_date>start_date),
        created_at TIMESTAMPTZ default CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ default CURRENT_TIMESTAMP

    );
     `);
    
    console.log("Coupons table created");
    
}
//createCouponsTable();

async function createCouponProductsTable() {
    await pool.query(
        `
    create table coupon_products(
    id serial primary key,
    coupon_id int not null,
    product_id int not null,
    
    constraint fk_coupon_products_coupon
    foreign key (coupon_id)
    references coupons(id)
    on delete CASCADE,
    
    Constraint fk_coupon_products_product
    foreign key (product_id)
    references products(id)
    on delete CASCADE,
    
    Constraint unique_coupon_product
    unique(coupon_id,product_id)
    );
        
        `
    );
    
    console.log("CouponProducts table created");
    
}
//createCouponProductsTable();

async function createCouponCategoriesTable(){
    await pool.query(`
        Create table coupon_categories(
        id serial primary key,
        coupon_id int not null,
        category_id int not null,
        
        constraint fk_coupon_categories_coupon
        foreign key (coupon_id)
        references coupons(id)
        on delete CASCADE,
        
        constraint fk_coupon_categories_category
        foreign key (category_id)
        references categories(id)
        on DELETE CASCADE,
        
        constraint unique_coupon_category
        unique (coupon_id,category_id));
        `);
        console.log("couponcategories table created");
        
}
createCouponCategoriesTable();

async function createTables(){
    try{
        //await createCouponsTable();
        //await createCouponProductsTable();
        await createCouponCategoriesTable();

        console.log("All tables created successfully");

    }catch(err){
        console.error(err);
    }finally{
        process.exit();
    }
}
createTables();