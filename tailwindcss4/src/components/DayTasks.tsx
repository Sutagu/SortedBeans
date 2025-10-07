import { AiOutlineEdit } from 'react-icons/ai';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BiCircle } from 'react-icons/bi';
import React from 'react';
import { useState, useEffect } from 'react';
interface Task {
  id: number;
  title: string;
  completed: boolean;
  est_time: number;
  category_id: number;
  assigned_date: string | null;
  description: string | null;
}
interface TaskFormData {
  title: string;
  est_time: number;
  category_id: number;
  assigned_date: string | null;
  description: string;
}

interface categoriesData {
  category_id: number;
  name: string;
}
interface Prop {
  currentDate: string;
  reloadTrigger: number;
  setReloadTrigger: React.Dispatch<React.SetStateAction<number>>;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  setPatchId: React.Dispatch<React.SetStateAction<number>>;
}
const DayTasks = ({
  currentDate,
  reloadTrigger,
  setReloadTrigger,
  setFormData,
  setPatchId,
}: Prop) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<categoriesData[]>([]);
  const convertTime = (date: string, estTime: number) => {
    const start = new Date(date);
    const end = new Date(start.getTime() + estTime * 60000);
    return {
      start: start.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      end: end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const toggleCompleted = (id: number) => {
    const currentTask = tasks.find((t) => t.id == id);
    if (!currentTask) return;

    const updateCompleted = !currentTask.completed;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: updateCompleted } : task
      )
    );
    console.log('local update');
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: updateCompleted }),
    }).catch((err) => console.error('Failed to update task:', err));
    setReloadTrigger((prev) => prev + 1);
  };

  const handleEstTimeChange = (id: number, newEstTime: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, est_time: newEstTime } : task
      )
    );
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ est_time: newEstTime }),
    }).catch((err) => console.error('Failed to update estimated time:', err));
    setReloadTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [taskRes, categoryRes] = await Promise.all([
        fetch('http://localhost:5000/api/tasks'),
        fetch('http://localhost:5000/api/task_categories'),
      ]);
      const taskData = await taskRes.json();
      const categoryData: categoriesData[] = await categoryRes.json();
      setTasks(taskData);
      setCategories(categoryData);
    };

    fetchData();
  }, [currentDate, reloadTrigger]);

  const colours = ['#2196A8', '#D6453D', '#F5A623', '#3FA34D'];

  return (
    <ul className="p-5 text-white max-h-8/10 lg:max-h-7/10 overflow-y-auto noScrollBar">
      {tasks
        .filter((task) => task.assigned_date?.slice(0, 10) === currentDate)
        .sort(
          (a, b) =>
            new Date(a.assigned_date!).getTime() -
            new Date(b.assigned_date!).getTime()
        )
        .map((task, idx) => {
          const { start, end } = convertTime(
            task.assigned_date!,
            task.est_time
          );
          return (
            <li className="text-left font-medium flex gap-6 py-4" key={task.id}>
              <div className="justify-between flex flex-col items-center text-blend">
                {start}
                <AiOutlineEdit
                  className="hover:text-accent hover:cursor-pointer text-xl"
                  onClick={() => {
                    setPatchId(task.id);
                    setFormData({
                      title: task.title,
                      est_time: task.est_time,
                      category_id: task.category_id,
                      assigned_date: task.assigned_date,
                      description: task.description || '',
                    });
                  }}
                />

                {end}
              </div>
              <div
                className={`w-8/10 p-[5%] rounded-xl transition-opacity ${
                  task.completed ? 'opacity-60' : ''
                }`}
                style={{ backgroundColor: colours[idx % colours.length] }}
              >
                <div className="flex justify-between">
                  <span className="text-xl font-san tracking-wide">
                    {task.title}
                  </span>
                  <span className="bg-black/20 rounded-md self-start flex gap-1 p-1">
                    <input
                      type="number"
                      value={task.est_time}
                      onChange={(e) =>
                        handleEstTimeChange(task.id, Number(e.target.value))
                      }
                      className="field-sizing-content hover:text-gray-light"
                    />
                    <p>Min</p>
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-light max-w-9/10 self-baseline-last">
                    {categories.find(
                      (cat) => cat.category_id == task.category_id
                    )?.name || 'Unassigned category'}{' '}
                    : {task.description || '...'}
                  </span>
                  <span
                    className="cursor-pointer text-xl self-baseline-last hover:text-purple-500 transition-colors"
                    onClick={() => toggleCompleted(task.id)}
                  >
                    {task.completed ? <AiOutlineCheckCircle /> : <BiCircle />}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
    </ul>
  );
};

export default DayTasks;
