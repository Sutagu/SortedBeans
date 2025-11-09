import { useState, Suspense, lazy } from 'react';
//Icons
import { CgSupport } from 'react-icons/cg'; //Settings icon
//Components In order
import portraits from '../assets/images/portraits/portraits';
import Clock from './Clock';
import WeatherTemp from './WeatherTemp';
const PortraitMap = lazy(() => import('./UserPortraits'));
const ThemePallete = lazy(() => import('./ThemePalette'));
const GitHubCalendar = lazy(() => import('react-github-calendar'));

const UserComponent = () => {
  const [settings, setSettings] = useState(false);
  const [calendarTheme, setCalendarTheme] = useState('dark');
  const [portraitPath, setPortraitPath] = useState<string>(
    portraits['./defaultGuy.webp']
  );
  return (
    <div className="innerContainer h-7/12! lg:p-[5%] lg:bg-primary/70!">
      <span className="flex justify-between items-center shrink-0">
        <div className="responsive-text">SORTED BEANS</div>
        <CgSupport
          className="text-xm hover:cursor-pointer hover:text-accent"
          onClick={() => setSettings((prev) => !prev)}
        />
      </span>
      <span className="flex h-4/12 shrink">
        <img
          src={portraits[portraitPath] || portraits['./defaultGuy.webp']}
          alt="Portrait"
          fetchPriority="low"
          className="inset-shadow-sm/40 inset-shadow-blend bg-accent rounded-2xl h-auto my-[2%]"
        />
        <span className={`${settings ? 'flex' : 'hidden'}`}>
          <PortraitMap setPortraitPath={setPortraitPath} />
        </span>
        <div
          className={`flex-col sm:max-lg:flex-row w-1/2 sm:w-3/4 lg:w-full h-fit self-center ${
            settings ? 'hidden' : 'flex'
          }`}
        >
          <Clock />
          <WeatherTemp />
        </div>
      </span>

      <span className={`${settings ? 'block text-left' : 'hidden'} mt-2`}>
        <ThemePallete setCalendarTheme={setCalendarTheme} />
      </span>
      <span
        className={`items-center gap-2 text-lg font-semibold h-1/10 shrink-0 ${
          settings ? 'hidden' : 'flex'
        }`}
      >
        <div className="responsive-text">Keep the Consistency 🔥</div>
      </span>

      <span
        className={`bg-accent-dark text-text grow p-2 rounded-xl shadow-xl ${
          settings ? 'hidden' : 'flex'
        }`}
      >
        <Suspense fallback={<div>Loading Git Contribution Graph...</div>}>
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
        </Suspense>
      </span>
    </div>
  );
};
export default UserComponent;
