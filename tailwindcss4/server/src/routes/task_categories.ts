import express, { Request, Response } from 'express';
import pool from '../db';

const router = express.Router();

// GET /api/tasks
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM task_categories');
    res.json(result.rows);
    console.log('Server loaded in task_categories');
  } catch (error) {
    console.error('Error encountered in Task_Category route:' + error);
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete(
  '/:category_id',
  async (req: Request, res: Response): Promise<any> => {
    const { category_id } = req.params;
    try {
      const result = await pool.query(
        `DELETE FROM task_categories WHERE category_id=$1 RETURNING *`,
        [category_id]
      );
      if (result.rowCount === 0)
        return res.status(404).json({ error: 'Task not found' });

      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
    }
  }
);

router.post('/', async (req: Request, res: Response): Promise<any> => {
  const { name } = req.body;
  if (name == '')
    return res.status(400).json({ error: 'Category name required' });
  try {
    const result = await pool.query(
      `INSERT INTO task_categories (name)
      VALUES($1)
      RETURNING *`,
      [name]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database Error' });
  }
});

export default router;
