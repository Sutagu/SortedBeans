import express, { Request, Response } from 'express';
import pool from '../db';

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
  const { completed } = req.body;
  const { id } = req.params;

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Invalid completed value' });
  }

  try {
    const result = await pool.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
      [completed, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
