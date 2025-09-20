import './App.css';
import { useEffect, useState } from 'react';
//Top left
import { BsFillGearFill } from 'react-icons/bs';
import portrait from './assets/images/portraits/defaultGuy.png';
import Clock from './components/Clock';
import WeatherTemp from './components/WeatherTemp';
import GitHubCalendar from 'react-github-calendar';
import PortraitMap from './components/UserPortraits';
import ThemePallete from './components/ThemePalette';

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
  const [settings, setSettings] = useState(false);
  const [theme, setTheme] = useState('default');
  const [calendarTheme, setCalendarTheme] = useState('dark');
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    est_time: 0,
    category_id: 1,
    assigned_date: '',
    description: '',
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return (
    <div className="w-screen h-screen grid grid-cols-3 bg-dark transition-colors">
      <div className="outerContainer flex flex-col gap-[5%]">
        <div className="innerContainer h-1/2 bg-primary/70! flex flex-col justify-between overflow-none p-[5%]">
          <span className="flex justify-between items-center shrink-0">
            <div className="text-left text-xm">SORTED BEANS</div>
            <BsFillGearFill
              className="text-xm hover:cursor-pointer hover:text-accent"
              onClick={() => setSettings((prev) => !prev)}
            />
          </span>
          <span className="flex h-4/12 shrink">
            <img
              src={portrait}
              alt="Portrait"
              className="inset-shadow-sm/40 inset-shadow-blend bg-accent rounded-2xl"
            />
            <div
              className={`flex-col scale-75 justify-center vertical-align ${
                settings ? 'hidden' : 'flex'
              }`}
            >
              <Clock />
              <WeatherTemp />
            </div>
            <span className={`${settings ? 'flex' : 'hidden'}`}>
              <PortraitMap />
            </span>
          </span>

          <span className={`${settings ? 'block text-left' : 'hidden'}`}>
            <ThemePallete
              setTheme={setTheme}
              setCalendarTheme={setCalendarTheme}
            />
          </span>
          <span
            className={`items-center gap-2 text-lg font-semibold h-1/10 shrink-0 ${
              settings ? 'hidden' : 'flex'
            }`}
          >
            <div className="text-accent">25 </div>
            <div className="">Days Consistent 🔥</div>
          </span>

          <span
            className={`bg-accent-dark text-text grow p-2 rounded-xl shadow-xl ${
              settings ? 'hidden' : 'flex'
            }`}
          >
            <GitHubCalendar
              username="Sutagu"
              theme={{
                dark: [
                  'var(--color-primary)',
                  'var(--color-blend)',
                  'var(--color-blend)',
                  'var(--color-blend)',
                  'var(--color-blend)',
                ],
                light: [
                  'var(--color-blend)',
                  'var(--color-accent)',
                  'var(--color-accent)',
                  'var(--color-accent)',
                  'var(--color-accent)',
                ],
              }}
              colorScheme={calendarTheme as 'dark' | 'light' | undefined}
            />
          </span>
        </div>
        <div className="innerContainer h-3/10 bg-linear-to-tr from-primary to-secondary bg-cover relative">
          <img
            src={logo}
            alt="logo"
            className="w-1/10 absolute z-99 left-5 bottom-5"
          />
          <Quotes />
        </div>
      </div>
      <div className="outerContainer">
        <div className="innerContainer h-[85%] w-full! rounded-none! bg-secondary">
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
        <div className="innerContainer h-[85%] max-h-[85%] flex  flex-col overflow-hidden  pb-[10%] text-white bg-primary/70!">
          <p className="text-left bg-accent-dark rounded-t-xl p-2 h-1/20 text-sm">
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
