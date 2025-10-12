//Icons
import { MdEditSquare } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { MdMoreHoriz } from 'react-icons/md';
import { CgMenu } from 'react-icons/cg';

import { useEffect, useState } from 'react';
import { useStateOrganiser } from '../useStateOrganiser';
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
};
const TaskList = ({ categoryId }: Prop) => {
  const SetEditId = useStateOrganiser((state) => state.setEditId);
  const setTaskFormData = useStateOrganiser((state) => state.setTaskFormData);
  const refreshPage = useStateOrganiser((state) => state.refreshPage);
  const setPageRefresh = useStateOrganiser((state) => state.setPageRefresh);

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
      setPageRefresh();
    }
  };
  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Failed to delete:', error.error || res.statusText);
        return;
      }

      setPageRefresh();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
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
  }, [categoryId, refreshPage]);

  return (
    <ul className="taskListContainer h-9/10 max-lg:bg-dark! bg-primary overflow-y-scroll shrink p-5">
      {tasks
        .filter(
          (task) =>
            task.category_id === categoryId && task.assigned_date == null
        )
        .map((task) => (
          <li
            key={task.id}
            className="text-left  border-blend border-t hover:bg-dark text-text transition"
          >
            <span className="py-4 flex items-center">
              <CgMenu className="rotate-90 w-1/12" />
              <div className="w-10/12">
                <p className="text-text text-lg">{task.title}</p>
                <p className="text-blend">{task.est_time} Min</p>
              </div>
              <MdMoreHoriz
                className="cursor-pointer text-text"
                role="button"
                aria-label="Task Options"
                onClick={() =>
                  setShownIndex((prev) => (prev != task.id ? task.id : null))
                }
              />
            </span>
            <span
              className={`items-center justify-between pb-4 px-2 text-text ${
                shownIndex == task.id ? 'flex flex-wrap' : 'hidden'
              }`}
            >
              <p className="w-full pb-2 text-blend">
                Description: {task.description}
              </p>
              <input
                type="datetime-local"
                name="assigned_date"
                value={input || ''}
                onChange={(e) => setInput(e.target.value)}
                className="bg-accent-dark shrink w-1/2  rounded-lg p-2"
              />
              <button
                onClick={() => assignTaskDate(task.id, input)}
                className="bg-white/20 rounded-lg p-2 hover:bg-[#76b6ce] transition-colors flex-none"
              >
                Confirm
              </button>
              <MdEditSquare
                className="bg-white/20 rounded-lg text-4xl p-2 hover:bg-accent transition-colors flex-none"
                onClick={() => {
                  SetEditId(task.id);
                  setTaskFormData({
                    title: task.title,
                    est_time: task.est_time,
                    category_id: task.category_id,
                    assigned_date: task.assigned_date,
                    description: task.description || '',
                  });
                }}
              />
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
