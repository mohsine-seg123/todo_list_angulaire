import pool from "../config/db.js";

// GET /tasks
// Retrieve all tasks
export const getTasks = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC",
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error retrieving tasks",
    });
  }
};

// POST /tasks
// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description = "" } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description)
             VALUES ($1, $2)
             RETURNING *`,
      [title.trim(), description],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error creating task",
    });
  }
};

// PUT /tasks/:id
// Update an existing task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, completed } = req.body;

    const result = await pool.query(
      `UPDATE tasks
             SET
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                completed = COALESCE($3, completed),
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING *`,
      [title, description, completed, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error updating task",
    });
  }
};

// DELETE /tasks/:id
// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error deleting task",
    });
  }
};
