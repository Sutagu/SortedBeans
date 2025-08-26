import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks';
import taskCategories from './routes/task_categories';
import portraits_getter from './routes/portraits_getter';
import path from 'path';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/assets', express.static(path.resolve(__dirname, '../../src/assets')));

app.use('/api/tasks', tasksRouter);
app.use('/api/task_categories', taskCategories);
app.use('/api/portraits_getter', portraits_getter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
