import express, { Request, Response } from 'express';
import pool from '../db';
const router = express.Router();

// GET /api/tasks
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
  } catch (error) {
    console.error('Error encountered in Task Route: ' + error);
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id=$1', [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Task not found' });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

router.patch('/:id', async (req: Request, res: Response): Promise<any> => {
  const { completed, est_time, assigned_date } = req.body;
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
  return res.status(400).json({ error: 'Invalid data' });
});

router.patch(
  '/update/:id',
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { title, est_time, category_id, assigned_date, description } =
      req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    try {
      const result = await pool.query(
        `UPDATE TASKS 
        SET title = $1,
           est_time = $2,
           category_id = $3,
           assigned_date = $4,
           description = $5
        WHERE id=$6
        RETURNING *`,
        [title, est_time, category_id, assigned_date, description, id]
      );
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database Error' });
    }
  }
);

router.post('/', async (req: Request, res: Response): Promise<any> => {
  const { title, est_time, category_id, assigned_date, description } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required' });

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
