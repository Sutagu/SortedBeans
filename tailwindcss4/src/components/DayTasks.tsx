//Icons
import { CgRadioCheck, CgCheckO, CgPen } from 'react-icons/cg';
//React
import { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
//Stores
import { useSetTaskFormData } from '../utils/useStateOrganiser';
import { useTaskStore } from '../postgresStore/taskStoreHook';
import { useCategoryStore } from '../postgresStore/categoryStoreHook';
interface Prop {
  currentDate: string;
}
const DayTasks = ({ currentDate }: Prop) => {
  //Public UseState Organiser Store
  const setTaskFormData = useSetTaskFormData();
  //API Hook
  const { tasks, editTask } = useTaskStore();
  const { categories } = useCategoryStore();
  //Local variable
  const [localEstTime, setLocalEstTime] = useState<Record<number, string>>({});
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

  const toggleCompleted = (id: number, completed: boolean) => {
    console.log('Toggle completed');
    editTask(id, 'completed', completed);
  };

  const debouncedHandleEstTimeChange = debounce(
    (id: number, newEstTime: string) => {
      editTask(id, 'est_time', newEstTime);
    },
    1500
  );

  const handleInputEstTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toString();
    const id = Number(e.target.id);
    setLocalEstTime((prev) => ({ ...prev, [id]: newValue }));
    debouncedHandleEstTimeChange(id, newValue);
  };

  useEffect(() => {
    console.log('Refreshing dayTasks');
  }, [currentDate, tasks]);

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
                <CgPen
                  className="hover:text-accent hover:cursor-pointer text-xl"
                  onClick={() => {
                    setTaskFormData(task);
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
                      id={task.id.toString()}
                      type="number"
                      aria-label="est minutes to complete task"
                      value={localEstTime[task.id] ?? task.est_time}
                      min={0}
                      max={1440}
                      onChange={handleInputEstTimeChange}
                      className="field-sizing-content hover:text-gray-light"
                    />
                    <p>Min</p>
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-light max-w-9/10 self-baseline-last">
                    {categories.find(
                      (cat) => cat.category_id === task.category_id
                    )?.name || 'Unassigned category'}{' '}
                    : {task.description || 'no description'}
                  </span>
                  <span
                    className="cursor-pointer text-xl self-baseline-last hover:text-purple-500 transition-colors"
                    onClick={() => {
                      toggleCompleted(task.id, !task.completed);
                    }}
                  >
                    {task.completed ? <CgCheckO /> : <CgRadioCheck />}
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
