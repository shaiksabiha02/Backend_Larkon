import pool from "../config/db.js";

 async function createStaticPagesTables(){
    try{
        //FAQ Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS faqs(
            id SERIAL PRIMARY KEY,
            category VARCHAR(100) NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            display_order INT DEFAULT 0 CHECK (display_order >= 0),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("FAQs table created");

        //Help Center Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS help_center(
            id SERIAL PRIMARY KEY,
            category VARCHAR(100),
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            author_name VARCHAR(150),
            video_count INT DEFAULT 0 CHECK (video_count >= 0),
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Help Center table created");

        //Privacy Policy Table
        await pool.query(`
           CREATE TABLE IF NOT EXISTS privacy_policy(
           id SERIAL PRIMARY KEY,
           title VARCHAR(255) NOT NULL,
           description TEXT NOT NULL,
           created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
           updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
           ); 
        `);
        console.log("Privacy Policy table is created");
        
        process.exit();

         }catch(error){
            console.log("Migration failed:",error);
            process.exit(1);
         }

}
createStaticPagesTables();