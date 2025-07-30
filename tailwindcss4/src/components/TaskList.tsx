import { FaEllipsisH } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  est_time: number;
  category_id: number;
  assigned_date: string | null;
}

type Prop = {
  categoryId: number;
};

const TaskList = ({ categoryId }: Prop) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then((res) => res.json())
      .then((data: Task[]) => {
        setTasks(data);
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err);
      });
  }, [categoryId]);

  return (
    <ul className="taskListContainer bg-[#3C2A21] h-[80%] max-h-[80%] overflow-y-scroll p-5">
      {tasks
        .filter(
          (task) =>
            task.category_id === categoryId && task.assigned_date == null
        )
        .map((task) => (
          <li
            key={task.id}
            className="text-left h-[10%] py-10 border-[#FFF0DC] border-t hover:bg-[#2d2424] flex items-center transition"
          >
            <RxHamburgerMenu className="rotate-90 w-1/12" />
            <div className="w-10/12">
              <p className="text-lg">{task.title}</p>
              <p className="text-[#E0C097]">{task.est_time} Min</p>
            </div>
            <FaEllipsisH
              className="cursor-pointer"
              role="button"
              aria-label="Task Options"
            />
          </li>
        ))}
    </ul>
  );
};

export default TaskList;
