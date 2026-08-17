import express from "express";

import {
    getTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
} from "../controllers/todo.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET ALL
router.get("/", authenticate,getTodos);

// GET BY ID
router.get("/:id", authenticate,getTodoById);

// CREATE
router.post("/",authenticate ,createTodo);

// UPDATE
router.patch("/:id",authenticate, updateTodo);

// DELETE
router.delete("/:id",authenticate, deleteTodo);

export default router;