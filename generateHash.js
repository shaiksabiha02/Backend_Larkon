import bcrypt from "bcryptjs";

const password = "Sarah@123";

const hash = await bcrypt.hash(password, 10);

console.log("Password Hash:");
console.log(hash);