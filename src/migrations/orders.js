import Pool from "../config/db.js";
async function createOrdersTable() {
    await Pool.query(`
           
CREATE TYPE order_status AS ENUM ('received', 'processing', 'shipped', 'delivered', 'cancelled');
            CREATE TYPE order_priority AS ENUM ('low','normal' ,'medium', 'high');
            CREATE TYPE ORDER_PAYMENT_STATUS AS ENUM ('pending', 'completed', 'failed','refunded');
        

            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                user_id INT NOT NULL,
                priority order_priority DEFAULT 'normal',
                total_amount NUMERIC(10, 2) NOT NULL,
                payment_status ORDER_PAYMENT_STATUS DEFAULT 'pending',
                items NUMERIC(10, 0) NOT NULL,
                Delivery_number varchar(20) NULL, 
                status order_status DEFAULT 'received',
                SHIPPING_ADDRESS TEXT,
                CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    
    );
 


            
    `);
    console.log("Orders table CREATED successfully.");
    process.exit();
};
 createOrdersTable();




       
  