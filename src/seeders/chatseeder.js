import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import pool from "../config/db.js";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

export async function seed() {
    try {

        console.log("Seeding Chat Database...");

        const db = await pool.query("SELECT current_database()");
        console.log("Database:", db.rows);

        const schema = await pool.query("SELECT current_schema()");
        console.log("Schema:", schema.rows);

        const tables = await pool.query(`
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE table_name = 'users';
        `);
        console.log("Users table:", tables.rows);
        const hashedPassword = await bcrypt.hash("123456", 10);
        const beforeCount = await pool.query(`
    SELECT COUNT(*) AS total
    FROM public.users;
`);

console.log("BEFORE INSERT:", beforeCount.rows);
        // ==========================
                  // USERS
        // ==========================
await pool.query(`
INSERT INTO users
(
    first_name,
    last_name,
    email,
    password,
    profile_image,
    phone,
    status
)
VALUES
('Rahul','Kumar','rahul@gmail.com',$1,'','9876543210','online'),
('Sai','Teja','sai@gmail.com',$1,'','9876543211','online'),
('Anil','Reddy','anil@gmail.com',$1,'','9876543212','offline'),
('Priya','Sharma','priya@gmail.com',$1,'','9876543213','online'),
('Kiran','Kumar','kiran@gmail.com',$1,'','9876543214','offline'),
('Pavan','Kalyan','pavan@gmail.com',$1,'','9876543215','online'),
('Deepika','Rao','deepika@gmail.com',$1,'','9876543216','online'),
('Arjun','Naidu','arjun@gmail.com',$1,'','9876543217','offline'),
('Sneha','Reddy','sneha@gmail.com',$1,'','9876543218','online')
ON CONFLICT (email) DO NOTHING;
`, [hashedPassword]);

console.log("9 Users Inserted Successfully");

const result = await pool.query(
    "SELECT COUNT(*) AS total FROM public.users"
);

console.log(result.rows);

const check = await pool.query(
    "SELECT id, email FROM public.users"
);

console.log("CHECK USERS:", check.rows);
        // =========================
             //CONVERSATIONS
        // ==========================

        await pool.query(`
            INSERT INTO conversations
            (
                type,
                group_name,
                group_image,
                created_by
            )
            VALUES

            ('private',NULL,NULL,1),

            ('private',NULL,NULL,2),

            ('group','Developers',NULL,1),

            ('group','Project Team',NULL,3),

            ('group','Testing Team',NULL,5);
        `);

        console.log("5 Conversations Inserted Successfully");
        // ==========================
               // CONVERSATION MEMBERS
        // ==========================

        await pool.query(`
            INSERT INTO conversation_members
            (
                conversation_id,
                user_id
            )
            VALUES

            (1,1),
            (1,2),

            (2,2),
            (2,3),

            (3,1),
            (3,2),
            (3,3),
            (3,4),

            (4,3),
            (4,5),
            (4,6),

            (5,5),
            (5,7),
            (5,8),
            (5,9);
        `);

        console.log("Conversation Members Inserted Successfully");
        
          // ==========================
                  // MESSAGES
         // ==========================

        await pool.query(`
            INSERT INTO messages
            (
                conversation_id,
                sender_id,
                message,
                message_type,
                attachment,
                is_read
            )
            VALUES

            (1,1,'Hello Sai','text',NULL,true),
            (1,2,'Hi Rahul','text',NULL,false),
            (1,1,'How are you?','text',NULL,false),

            (2,2,'Project Started','text',NULL,true),
            (2,3,'Okay','text',NULL,true),
            (2,2,'Please check updates','text',NULL,false),

            (3,1,'Welcome Team','text',NULL,true),
            (3,2,'Good Morning Everyone','text',NULL,true),
            (3,3,'Task Completed','text',NULL,false),
            (3,4,'Excellent Work','text',NULL,false),

            (4,3,'Testing Started','text',NULL,true),
            (4,5,'Bug Fixed','text',NULL,true),
            (4,6,'Need One More Change','text',NULL,false),

            (5,5,'Meeting at 5 PM','text',NULL,true),
            (5,7,'Okay','text',NULL,true),
            (5,8,'Joining Soon','text',NULL,false),
            (5,9,'See You There','text',NULL,false);
        `);

        console.log("Messages Inserted Successfully");
                
        // ==========================
             // MESSAGE REACTIONS
        // ==========================
        await pool.query(`
            INSERT INTO message_reactions
            (
                message_id,
                user_id,
                reaction
            )
            VALUES
            (1,2,'👍'),
            (2,1,'❤️'),
            (5,3,'😊'),
            (8,4,'🔥'),
            (12,5,'👏');
        `);

        console.log("Message Reactions Inserted Successfully");

        // ==========================
              // NOTIFICATIONS
        // ==========================

        await pool.query(`
            INSERT INTO notifications
            (
                user_id,
                title,
                message,
                is_read
            )
            VALUES

            (1,'New Message','You received a new message',false),

            (2,'Group Added','You were added to Developers',true),

            (3,'Reminder','Complete your assigned task',false),

            (4,'Meeting','Daily standup at 10 AM',false),

            (5,'Project Update','Project updated successfully',true),

            (6,'Welcome','Welcome to Team Chat',false),

            (7,'Mention','You were mentioned in a message',false),

            (8,'New Chat','You have a new conversation',true),

            (9,'System','System updated successfully',false);
        `);

        console.log("Notifications Inserted Successfully");


        // ==========================
               // ATTACHMENTS
        // ==========================

        await pool.query(`
            INSERT INTO attachments
            (
                message_id,
                file_name,
                file_path,
                file_size
            )
            VALUES

            (1,'image1.jpg','uploads/image1.jpg','120KB'),

            (2,'document.pdf','uploads/document.pdf','500KB'),

            (5,'report.docx','uploads/report.docx','250KB'),

            (8,'design.png','uploads/design.png','350KB'),

            (12,'notes.txt','uploads/notes.txt','15KB');
        `);
    console.log("Attachments Inserted Successfully");

    console.log("=================================");
    console.log("Chat Seeder Completed Successfully");
    console.log("=================================");

    // CHECK USERS COUNT
    const usersCount = await pool.query(`
        SELECT COUNT(*) AS total
        FROM public.users;
    `);

    console.log("USERS COUNT AFTER INSERT:", usersCount.rows);

} catch (error) {

    console.error("Seeder Error:", error.message);

} finally {

    await pool.end();

}

}

seed();