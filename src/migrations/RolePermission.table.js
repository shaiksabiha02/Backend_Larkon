import pool from "../config/db.js";
const createRolePermissionTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS role_permissions (
            id SERIAL PRIMARY KEY,
            role_id INT NOT NULL,
            permission_id INT NOT NULL,
            CONSTRAINT fk_role
            FOREIGN KEY (role_id)
            REFERENCES roles(id)
            ON DELETE CASCADE,
            CONSTRAINT fk_permission
            FOREIGN KEY (permission_id)
            REFERENCES permissions(id)
            ON DELETE CASCADE
        );
    `);
    console.log("Role Permissions table created successfully.");
} catch (error) {
    console.error("Error creating role permissions table:", error.message);
}finally {
    process.exit();
    }
};
createRolePermissionTable();

