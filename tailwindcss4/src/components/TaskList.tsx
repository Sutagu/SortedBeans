//Icons
import { CgMenu, CgPen, CgTrash, CgMore } from 'react-icons/cg';

import { useEffect, useState } from 'react';
import { useStateOrganiser } from '../utils/useStateOrganiser';
import { useTaskStore } from '../hooks/taskStoreHook';
import type { Task } from '../utils/types';

const TaskList = () => {
  const SetEditId = useStateOrganiser((state) => state.setEditId);
  const setTaskFormData = useStateOrganiser((state) => state.setTaskFormData);
  const refreshPage = useStateOrganiser((state) => state.refreshPage);
  const setPageRefresh = useStateOrganiser((state) => state.setPageRefresh);
  const categoryId = useStateOrganiser(
    (state) => state.categoryData.category_id
  );

  const [tasks, setTasks] = useState<Task[]>([]);
  const [shownIndex, setShownIndex] = useState<number | null>(null);
  const [input, setInput] = useState<string | null>(null);

  const { deleteTask } = useTaskStore();

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
              <CgMore
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
              <CgPen
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
              <CgTrash
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
