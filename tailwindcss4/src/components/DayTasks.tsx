import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BiCircle } from 'react-icons/bi';
import React from 'react';
import { useState, useEffect } from 'react';
import Line from '../assets/images/bg/line.png';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  est_time: number;
  category_id: number;
  assigned_date: string | null;
  description: string | null;
}

const DayTasks: React.FC<{ currentDate: string }> = ({ currentDate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [taskRes, categoryRes] = await Promise.all([
        fetch('http://localhost:5000/api/tasks'),
        fetch('http://localhost:5000/api/task_categories'),
      ]);
      const taskData = await taskRes.json();
      const categoryData: { name: string }[] = await categoryRes.json();

      setTasks(taskData);
      setCategories(categoryData.map((c) => c.name));
    };

    fetchData();
  }, [currentDate]);

  const colours = ['#2196A8', '#D6453D', '#F5A623', '#3FA34D'];
  return (
    <ul className="p-5 text-[#F7F7F7] h-[70%] max-h-[70%] overflow-y-auto noScrollBar">
      {tasks
        .filter((task) => task.assigned_date?.slice(0, 10) === currentDate)
        .map((task, idx) => (
          <li
            className="w-full text-left font-medium flex gap-6 items-center py-4"
            key={task.id}
          >
            <img className="h-3" src={Line} />
            <div
              className="w-[75%] p-[5%] rounded-xl "
              style={{ backgroundColor: colours[idx % colours.length] }}
            >
              <div className="flex justify-between">
                <span className="text-xl font-san tracking-wide">
                  {task.title}
                </span>
                <span className="bg-black/20 w-2/10 text-center rounded-md">
                  {task.est_time} Min
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-light max-w-9/10 self-baseline-last">
                  {categories[task.category_id - 1]} : {task.description || ''}
                </span>
                <span className="cursor-pointer text-xl self-baseline-last">
                  {task.completed ? <AiOutlineCheckCircle /> : <BiCircle />}
                </span>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default DayTasks;
