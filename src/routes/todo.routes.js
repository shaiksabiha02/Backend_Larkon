import express from "express";

import {
    getTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
} from "../controllers/todo.controller.js";

const router = express.Router();

// GET ALL
router.get("/", getTodos);

// GET BY ID
router.get("/:id", getTodoById);

// CREATE
router.post("/", createTodo);

// UPDATE
router.patch("/:id", updateTodo);

// DELETE
router.delete("/:id", deleteTodo);

export default router;