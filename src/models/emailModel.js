const pool = require("../config/db");

const getAllEmails = async () => {
  const result = await pool.query(`
    SELECT
      e.id,
      e.sender_id,
      e.receiver_email,
      e.subject,
      e.folder,
      el.label_name
    FROM emails e
    LEFT JOIN email_labels el
      ON e.id = el.email_id
    ORDER BY e.id;
  `);

  return result.rows;
};

module.exports = {
  getAllEmails
};