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
  const { field, value } = req.body;
  const { id } = req.params;

  const validFields = ['completed', 'est_time', 'assigned_date'];
  if (!validFields.includes(field))
    return res.status(400).json({ error: 'Not a valid field' });

  try {
    const result = await pool.query(
      `UPDATE tasks SET ${field} = $1 WHERE id = $2 RETURNING *`,
      [value, id]
    );
    if (result.rowCount === 0) return res.status(404).json('Task not found');
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database Error' });
  }
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
  const {
    title,
    est_time,
    category_id,
    assigned_date,
    description,
    client_id,
  } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required' });
  const checkClientId = !client_id ? 'client-' : client_id;
  console.log(checkClientId);
  try {
    const { rows } = await pool.query(
      `INSERT INTO tasks (title, completed, est_time, category_id, assigned_date, description, client_id)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, client_id`,
      [
        title,
        false,
        est_time,
        category_id,
        assigned_date,
        description,
        checkClientId,
      ]
    );
    const { id, client_id } = rows[0];
    res.status(201).json({ id: id, client_id: client_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database Error' });
  }
});

export default router;
