import pool from "./src/db.js";
async function checkTables() {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `);

    console.log(result.rows);
  } catch (error) {
    console.log(error);
  } finally {
    await pool.end();
  }
}

checkTables();