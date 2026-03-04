import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  // - Create task
  // - Attach owner = req.user._id

  try {
    const { title, description } = req.body;

    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }
    const task = new Task({
      title,
      description,
      owner: req.user._id
    });

    await task.save();
    res.status(201).json(task);
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
    return;
  }
});

// GET /api/tasks
router.get("/", async (req, res) => {
  // - Return only tasks belonging to req.user

  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.status(200).json(tasks);
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to get tasks" });
    return;
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  // - Check ownership
  // - Delete task

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      res.status(404).json({ message: "Task not found" })
      return;
    }
    await Task.deleteOne({ _id: req.params.id })
    res.status(200).json({ message: "Task deleted successfully" })
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" })
    return;
  }
});

export default router;