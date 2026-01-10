import { useState, Suspense, lazy } from 'react';
//Icons
import { CgSupport } from 'react-icons/cg'; //Settings icon
//Components
import { signInWithGithub } from '../utils/supabase';
import { useGetUser } from '../utils/useStateOrganiser';
import portraits from '../assets/images/portraits/portraits';
import GitIcon from '../assets/images/logo/github-light.webp';

const Clock = lazy(() => import('./Clock'));
const GitHubCalendar = lazy(() => import('react-github-calendar'));
const WeatherTemp = lazy(() => import('./WeatherTemp'));
const PortraitMap = lazy(() => import('./UserPortraits'));
const ThemePallete = lazy(() => import('./ThemePalette'));

const UserComponent = () => {
  const user = useGetUser();
  const [settings, setSettings] = useState(false);
  const [calendarTheme, setCalendarTheme] = useState('dark');
  const [portraitPath, setPortraitPath] = useState<string>(
    portraits['./defaultGuy.webp']
  );

  return (
    <div className="innerContainer flex flex-col gap-2 h-7/12! lg:p-[5%] lg:bg-primary/70!">
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
          loading="lazy"
          className="inset-shadow-sm/40 inset-shadow-blend bg-accent rounded-2xl h-auto my-[2%]"
        />
        <span className={`${settings ? 'flex' : 'hidden'}`}>
          <Suspense fallback={<div>Loading Portrait Track...</div>}>
            <PortraitMap setPortraitPath={setPortraitPath} />
          </Suspense>
        </span>
        <div
          className={`flex-col sm:max-lg:flex-row justify-evenly sm:w-3/4 lg:w-full h-fit self-center ${
            settings ? 'hidden' : 'flex'
          }`}
        >
          <Suspense fallback={<div>Loading Location Data...</div>}>
            <Clock />
            <WeatherTemp />
          </Suspense>
        </div>
      </span>

      <span className={`${settings ? 'block text-left' : 'hidden'} mt-2`}>
        <Suspense fallback={<div>Loading Page Themes...</div>}>
          <ThemePallete setCalendarTheme={setCalendarTheme} />
        </Suspense>
      </span>
      <span
        className={`items-center gap-2 text-lg font-semibold h-1/10 shrink-0 ${
          settings ? 'hidden' : 'flex'
        }`}
      >
        <div className="responsive-text">Keep the Consistency 🔥</div>
      </span>

      <span
        className={`text-text p-2 lg:grow lg:h-2 rounded-xl justify-center items-center ${
          settings ? 'hidden' : 'flex'
        } ${user == null ? 'bg-none' : 'bg-accent-dark'}`}
      >
        <Suspense fallback={<div>Loading Git Contribution Graph...</div>}>
          {user == null ? (
            <button
              className="bg-accent w-full shadow-xl p-4 rounded-xl cursor-pointer flex justify-center items-center gap-2"
              onClick={signInWithGithub}
            >
              Sign in with Github
              <img className="size-5" src={GitIcon} alt="GitHub Icon" />
            </button>
          ) : (
            <GitHubCalendar
              username={user.user_metadata.user_name}
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
          )}
        </Suspense>
      </span>
    </div>
  );
};
export default UserComponent;
