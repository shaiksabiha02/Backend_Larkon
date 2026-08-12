import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
console.log("DATABASE URL:", process.env.DATABASE_URL);
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
pool.connect()
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log("Database Connection Error:", err.message);
  });


export default pool;