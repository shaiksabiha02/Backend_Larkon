import bcrypt from "bcryptjs";

const password = "Rabbani@786";

const hash = await bcrypt.hash(password, 10);

console.log("Password Hash:");
console.log(hash);