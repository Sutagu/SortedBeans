import express, { Request, Response } from 'express';
import pool from '../db';
import { error } from 'console';

const router = express.Router();

// GET /api/tasks
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.patch('/:id', async (req: Request, res: Response): Promise<any> => {
  const { completed, est_time, assigned_date, del } = req.body;
  const { id } = req.params;

  if (typeof completed === 'boolean') {
    try {
      const result = await pool.query(
        'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
        [completed, id]
      );
      if (result.rowCount === 0)
        return res.status(404).json({ error: 'Task not found' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (typeof est_time === 'number') {
    try {
      const result = await pool.query(
        'UPDATE tasks SET est_time = $1 WHERE id = $2 RETURNING *',
        [est_time, id]
      );
      if (result.rowCount === 0)
        return res.status(404).json({ error: 'Task not found' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (typeof assigned_date === 'string') {
    try {
      const result = await pool.query(
        'UPDATE tasks SET assigned_date = $1 WHERE id =$2 RETURNING *',
        [assigned_date, id]
      );
      if (result.rowCount === 0)
        return res.status(404).json({ error: 'Task not found' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
  }
  if (typeof del === 'boolean') {
    try {
      const result = await pool.query('DELETE FROM tasks WHERE id=$1', [id]);
      if (result.rowCount === 0)
        return res.status(404).json({ error: 'Task not found' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  return res.status(400).json({ error: 'Invalid data' });
});

router.post('/', async (req: Request, res: Response): Promise<any> => {
  const { title, est_time, category_id, assigned_date, description } = req.body;

  if (!title)
    return res
      .status(400)
      .json({ error: 'Title and assigned_date are required' });

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, completed, est_time, category_id, assigned_date, description)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [title, false, est_time, category_id, assigned_date, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database Error' });
  }
});

export default router;
