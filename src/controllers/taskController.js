import Task from "../models/Task.js";

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const task = new Task({
            title,
            description,
            owner: req.user._id
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to create task" });
    }
};

// Get all tasks for the authenticated user
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to get tasks" });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await Task.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task" });
    }
};
