import {
    fetchTasks,
    fetchTodoById,
    createTask,
    updateTask,
    deleteTask
} from "../models/todo.model.js";
// =====================
    // GET TODO BY ID
// =====================
export const getTodoById = async (req, res) => {

    try {

        const { id } = req.params;

        const task = await fetchTodoById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });

    } catch (error) {

        console.error("GET TODO BY ID ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =====================
      // GET ALL TODOS
// =====================
export const getTodos = async (req, res) => {
    try {
        console.log("QUERY:", req.query);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const offset = (page - 1) * limit;

        const result = await fetchTasks(limit, offset);

        res.status(200).json({
            success: true,
            data: result.tasks,
            pagination: {
                page: page,
                limit: limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit)
            }
        });

    } catch (error) {

        console.error("GET TODOS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================
       // CREATE TODO
// ======================
export const createTodo = async (req, res) => {

    console.log("HEADERS:", req.headers);
    console.log("BODY:", req.body);

    try {

        const task = await createTask(req.body);

        res.status(201).json({
            success: true,
            message: "Task Created Successfully",
            data: task
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================
         // UPDATE TODO
// ======================
export const updateTodo = async (req, res) => {

    try {

        const { id } = req.params;

        const task = await updateTask(id, req.body);

        res.status(200).json({
            success: true,
            message: "Task Updated Successfully",
            data: task
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================
// DELETE TODO
// ======================
export const deleteTodo = async (req, res) => {

    try {

        const { id } = req.params;

        await deleteTask(id);

        res.status(200).json({
            success: true,
            message: "Task Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};