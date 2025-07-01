import express, { Request, Response } from 'express';
import pool from '../db';

const router = express.Router();

// GET /api/tasks
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM task_categories');
    res.json(result.rows);
    console.log("Server loaded in task_categories");
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
