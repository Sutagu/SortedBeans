import { MdDelete } from 'react-icons/md';
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
  description: string;
}

type Prop = {
  categoryId: number;
  reloadTrigger: number;
  setReloadTrigger: React.Dispatch<React.SetStateAction<number>>;
};

const TaskList = ({ categoryId, reloadTrigger, setReloadTrigger }: Prop) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [shownIndex, setShownIndex] = useState<number | null>(null);
  const [input, setInput] = useState<string | null>(null);
  const assignTaskDate = (id: number, assigned_date: string | null) => {
    if (assigned_date != null || assigned_date != '') {
      fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assigned_date }),
      }).catch((err) => console.error('Failed to update assigned date:', err));
      setReloadTrigger((prev) => prev + 1);
    }
  };
  const deleteTask = (id: number) => {
    const del = true;
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ del }),
    }).catch((err) => console.error('Failed to delete:', err));
    setReloadTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then((res) => res.json())
      .then((data: Task[]) => {
        setTasks(data);
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err);
      });
  }, [categoryId, reloadTrigger]);

  return (
    <ul className="taskListContainer h-8/10 secondary overflow-y-scroll shrink p-5">
      {tasks
        .filter(
          (task) =>
            task.category_id === categoryId && task.assigned_date == null
        )
        .map((task) => (
          <li
            key={task.id}
            className="text-left  border-[#FFF0DC] border-t hover:bg-[#2d2424]  transition"
          >
            <span className="py-4 flex items-center">
              <RxHamburgerMenu className="rotate-90 w-1/12" />
              <div className="w-10/12">
                <p className="text-lg">{task.title}</p>
                <p className="text-[#E0C097]">{task.est_time} Min</p>
              </div>
              <FaEllipsisH
                className="cursor-pointer"
                role="button"
                aria-label="Task Options"
                onClick={() =>
                  setShownIndex((prev) => (prev != task.id ? task.id : null))
                }
              />
            </span>
            <span
              className={`items-center justify-between pb-4 px-2 ${
                shownIndex == task.id ? 'flex flex-wrap' : 'hidden'
              }`}
            >
              <p className="w-full pb-2 text-gray-300">
                Description: {task.description}
              </p>
              <input
                type="datetime-local"
                name="assigned_date"
                value={input || ''}
                onChange={(e) => setInput(e.target.value)}
                className="bg-[#76b6ce] shrink rounded-lg p-2 text-black invert"
              />
              <button
                onClick={() => assignTaskDate(task.id, input)}
                className="bg-white/20 rounded-lg p-2 hover:bg-[#76b6ce] transition-colors flex-none"
              >
                Save Changes
              </button>
              <MdDelete
                title="Delete task"
                className="p-2 bg-white/20 rounded-lg text-4xl hover:bg-red-600 transition-colors"
                onClick={() => deleteTask(task.id)}
              />
            </span>
          </li>
        ))}
    </ul>
  );
};

export default TaskList;
