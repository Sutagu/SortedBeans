import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks';
import taskCategories from './routes/task_categories';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);
app.use('/api/task_categories', taskCategories);


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
