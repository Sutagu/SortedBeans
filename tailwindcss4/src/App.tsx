import './App.css';
import React, { useState } from 'react';
//Top left
import { BsFillGearFill } from 'react-icons/bs';
import portrait from './assets/images/portraits/standardguy1.png';
import Clock from './components/Clock';
import WeatherTemp from './components/WeatherTemp';
import GitHubCalendar from 'react-github-calendar';

//Bottom left
import logo from './assets/images/logo/logoTpLarge.png';
import Quotes from './components/Quotes';

//Middle
import DayPlan from './components/DayPlan';

//right
import TaskCategorySelector from './components/taskCategorySelector';
import TaskList from './components/TaskList';

function App() {
  const [category, setCategory] = useState<{
    category_id: number;
    name: string;
  }>({
    category_id: 0,
    name: 'NULL',
  });
  interface TaskFormData {
    title: string;
    est_time: number;
    category_id: number;
    assigned_date: string | null;
    description: string;
  }
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mainReloadTrigger, setMainReloadTrigger] = useState(0);
  const [patchId, setPatchId] = useState(0);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    est_time: 0,
    category_id: 1,
    assigned_date: '',
    description: '',
  });
  return (
    <div className="w-screen h-screen grid grid-cols-3">
      <div className="outerContainer flex flex-col gap-[5%]">
        <div className="innerContainer bg-primary/70! h-[50%] grid grid-cols-2 grid-rows-[10%_40%_10%_40%] p-[5%]">
          <div className="text-left text-xm self-start">SORTED BEANS</div>
          <BsFillGearFill className="ml-auto text-xm self-start" />

          <img
            src={portrait}
            alt="Portrait"
            className="box-shadow bg-accent h-full rounded-2xl"
          />
          <div className="flex flex-col justify-center vertical-align">
            <Clock />
            <WeatherTemp />
          </div>

          <div className="flex items-center col-span-2 gap-2 text-lg font-semibold">
            <div className="record-string text-accent">25 </div>
            <div className="record-string">Days Consistent 🔥</div>
          </div>

          <div className="col-span-2 bg-accent-dark p-4 rounded-xl shadow-xl">
            <GitHubCalendar
              username="Sutagu"
              theme={{
                light: ['#5C3D2E', '#c6e48b', '#E0C097', '#b39a79', '#9d866a'],
              }}
              colorScheme="light"
            />
          </div>
        </div>
        <div className="innerContainer h-3/10 bg-[url(assets/images/bg/dessert.jpg)] bg-cover relative">
          <img
            src={logo}
            alt="logo"
            className="w-1/10 absolute z-99 left-5 bottom-5"
          />
          <Quotes />
        </div>
      </div>
      <div className="outerContainer">
        <div className="innerContainer h-[85%] w-full! rounded-none!">
          <DayPlan
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            mainReloadTrigger={mainReloadTrigger}
            setMainReloadTrigger={setMainReloadTrigger}
            setFormData={setFormData}
            setPatchId={setPatchId}
          />
        </div>
      </div>
      <div className="outerContainer">
        <div className="innerContainer h-[85%] max-h-[85%] flex  flex-col overflow-hidden  pb-[10%] text-white bg-primary!">
          <p className="text-left bg-accent rounded-t-xl p-2 h-1/20 text-sm">
            Create Delete Assign your Tasks!
          </p>
          <TaskCategorySelector
            selected={category}
            onChange={setCategory}
            reloadTrigger={mainReloadTrigger}
            setReloadTrigger={setMainReloadTrigger}
            formData={formData}
            setFormData={setFormData}
            patchId={patchId}
            setPatchId={setPatchId}
          />
          <TaskList
            categoryId={category.category_id}
            reloadTrigger={mainReloadTrigger}
            setReloadTrigger={setMainReloadTrigger}
            setFormData={setFormData}
            setPatchId={setPatchId}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
