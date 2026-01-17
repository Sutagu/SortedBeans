//Icons
import { CgMenu, CgPen, CgTrash, CgMore } from 'react-icons/cg';

import { useEffect, useState } from 'react';
import { UseSupabaseTaskStore } from '../supabaseStore/taskApi';
import {
  useSetTaskFormData,
  useGetCategoryData,
  useReset,
} from '../utils/useStateOrganiser';

const TaskList = () => {
  //Public Use State Organiser Store
  const setTaskFormData = useSetTaskFormData();
  const categoryId = useGetCategoryData().category_id;
  const resetFormData = useReset();
  //Api fetch
  const { tasks, fetchTasks, deleteTask, editTask } = UseSupabaseTaskStore();
  //Private Variables
  const [shownIndex, setShownIndex] = useState<number | null>(null);
  const [input, setInput] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
                onClick={() => {
                  editTask(task.id, 'assigned_date', input);
                  resetFormData();
                }}
                className="bg-white/20 rounded-lg p-2 hover:bg-[#76b6ce] transition-colors flex-none"
              >
                Confirm
              </button>
              <CgPen
                className="bg-white/20 rounded-lg text-4xl p-2 hover:bg-accent transition-colors flex-none"
                onClick={() => {
                  setTaskFormData(task);
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
