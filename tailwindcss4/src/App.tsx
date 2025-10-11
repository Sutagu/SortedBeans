import { GiHamburgerMenu } from 'react-icons/gi';
import { BiHomeAlt2 } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import './App.css';
import { useEffect, useState } from 'react';
//Top left
import { BsFillGearFill } from 'react-icons/bs';
import Clock from './components/Clock';
import WeatherTemp from './components/WeatherTemp';
import GitHubCalendar from 'react-github-calendar';
import PortraitMap from './components/UserPortraits';
import ThemePallete from './components/ThemePalette';
import portraits from './assets/images/portraits/portraits';

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
  const [mainReloadTrigger, setMainReloadTrigger] = useState(0);
  const [settings, setSettings] = useState(false);
  const [theme, setTheme] = useState('default');
  const [calendarTheme, setCalendarTheme] = useState('dark');
  const [portraitPath, setPortraitPath] = useState<string>(
    portraits['./defaultGuy.png']
  );

  const [footerState, setFooterState] = useState('calendar');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme, portraitPath]);
  return (
    <div className="w-screen h-screen flex flex-col justify-evenly lg:grid lg:grid-cols-3 transition-colors">
      <div
        className={`responsive-container flex flex-col  lg:justify-between! select-none ${
          footerState == 'profile' ? 'items-center' : 'max-lg:hidden'
        }`}
      >
        <div className="innerContainer h-7/12! lg:p-[5%] lg:bg-primary/70!">
          <span className="flex justify-between items-center shrink-0">
            <div className="responsive-text">SORTED BEANS</div>
            <BsFillGearFill
              className="text-xm hover:cursor-pointer hover:text-accent"
              onClick={() => setSettings((prev) => !prev)}
            />
          </span>
          <span className="flex h-4/12 shrink">
            <img
              src={portraits[portraitPath] || portraits['./defaultGuy.png']}
              alt="Portrait"
              className="inset-shadow-sm/40 inset-shadow-blend bg-accent rounded-2xl h-auto my-[2%]"
            />
            <div
              className={`flex-col sm:max-lg:flex-row w-1/2 sm:w-3/4 lg:w-full h-fit self-center ${
                settings ? 'hidden' : 'flex'
              }`}
            >
              <Clock />
              <WeatherTemp />
            </div>
            <span className={`${settings ? 'flex' : 'hidden'}`}>
              <PortraitMap setPortraitPath={setPortraitPath} />
            </span>
          </span>

          <span className={`${settings ? 'block text-left' : 'hidden'} mt-2`}>
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
            <div className="responsive-text">Keep the</div>
            <div className="text-accent responsive-text">Consistency 🔥</div>
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
        <div className="innerContainer max-lg:rounded-2xl! h-4/12! bg-linear-to-tr from-primary to-secondary relative">
          <img
            src={logo}
            alt="logo"
            className="w-1/10 absolute z-99 left-5 bottom-5"
          />
          <Quotes />
        </div>
      </div>
      <div
        className={`responsive-container ${
          footerState == 'calendar'
            ? 'max-lg:block w-full! max-lg:self-start!'
            : 'max-lg:hidden'
        }`}
      >
        <div className="innerContainer w-full! rounded-none! lg:bg-secondary">
          <DayPlan
            reloadTrigger={mainReloadTrigger}
            setReloadTrigger={setMainReloadTrigger}
          />
        </div>
      </div>
      <div
        className={`responsive-container ${
          footerState == 'tasks'
            ? 'max-lg:block max-lg:w-screen'
            : 'max-lg:hidden'
        }`}
      >
        <div className="innerContainer flex flex-col max-lg:w-full! lg:pb-[10%] lg:bg-primary/70!">
          <p className="max-lg:hidden text-left bg-accent-dark lg:rounded-t-xl p-2 h-1/20 text-sm">
            Create Delete Assign your Tasks!
          </p>
          <TaskCategorySelector
            selected={category}
            onChange={setCategory}
            reloadTrigger={mainReloadTrigger}
            setReloadTrigger={setMainReloadTrigger}
          />
          <TaskList
            categoryId={category.category_id}
            reloadTrigger={mainReloadTrigger}
            setReloadTrigger={setMainReloadTrigger}
          />
        </div>
      </div>
      <footer className="lg:hidden! self-center w-8/10 bg-secondary/30 rounded-2xl border-1 border-text flex justify-around py-4 z-auto">
        <CgProfile
          className="footer-icon"
          onClick={() => setFooterState('profile')}
        />
        <BiHomeAlt2
          className="footer-icon"
          onClick={() => setFooterState('calendar')}
        />
        <GiHamburgerMenu
          className="footer-icon"
          onClick={() => setFooterState('tasks')}
        />
      </footer>
    </div>
  );
}

export default App;
