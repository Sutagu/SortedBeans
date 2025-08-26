import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    console.log('portrait server called running');
    const imgDir = path.resolve(
      __dirname,
      '../../../src/assets/images/portraits'
    );

    // Check if directory exists
    if (!fs.existsSync(imgDir)) {
      return res.status(404).json({ error: 'Directory not found' });
    }

    const files = fs.readdirSync(imgDir);
    const imageFiles = files.filter((file) => /\.(png|jpe?g|svg)$/i.test(file));

    res.json(imageFiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
