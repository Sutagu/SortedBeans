import './App.css';
import { useEffect, useState, lazy, Suspense } from 'react';
//Footer icons (for mobile)
import { CgMenu, CgHome, CgProfile } from 'react-icons/cg';
//States Tracker
import { useGitHubUser, useStateOrganiser } from './utils/useStateOrganiser';
import { supabase } from './utils/supabase';
//Offline Cache sync
import { enableOfflineSync } from './utils/enableOfflineSync';
//Top left
const UserComponent = lazy(() => import('./components/UserComponent'));
//Bottom left
import logo from './assets/images/logo/logoTpLarge.webp';
const Quotes = lazy(() => import('./components/Quotes'));
//Middle
import DayPlan from './components/DayPlan';
//Right
import TaskCategorySelector from './components/CategoryFunctions';
const TaskList = lazy(() => import('./components/TaskList'));

enableOfflineSync();

function App() {
  //UseEffects UseStates
  const setGitHubUser = useGitHubUser();
  const theme = useStateOrganiser((state) => state.uiTheme);
  const [footerState, setFooterState] = useState('calendar');

  useEffect(() => {
    async function initAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setGitHubUser(session.user);
      }
    }
    initAuth();
    //Sets theme of the app, refreshes when theme is changed
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme, setGitHubUser]);

  return (
    <div className="main-container transition-colors">
      <div
        className={`responsive-container flex flex-col  lg:justify-between! select-none ${
          footerState == 'profile' ? 'items-center' : 'max-lg:hidden'
        }`}
      >
        <Suspense fallback={<div>Loading User Profile...</div>}>
          <UserComponent />
        </Suspense>
        <div className="innerContainer h-4/12! bg-linear-to-tr from-primary to-secondary relative">
          <img
            src={logo}
            alt="logo"
            loading="lazy"
            className="w-1/10 absolute z-99 left-5 bottom-5"
          />
          <Suspense fallback={<div>Loading Quotes...</div>}>
            <Quotes />
          </Suspense>
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
          <DayPlan />
        </div>
      </div>
      <div
        className={`responsive-container ${
          footerState == 'tasks'
            ? 'max-lg:block max-lg:w-full'
            : 'max-lg:hidden'
        }`}
      >
        <div className="innerContainer flex flex-col max-lg:w-full! lg:pb-[10%] lg:bg-primary/70!">
          <p className="max-lg:hidden text-left bg-accent-dark lg:rounded-t-xl p-2 h-1/20 text-xs xl:text-sm">
            Create Delete Assign your Tasks!
          </p>
          <TaskCategorySelector />
          <Suspense fallback={<div>Loading Tasks for Day...</div>}>
            <TaskList />
          </Suspense>
        </div>
      </div>
      <footer className="lg:hidden! self-center w-8/10 bg-secondary/30 rounded-2xl border-1 border-text flex justify-around py-4 z-auto">
        <CgProfile
          className="footer-icon"
          onClick={() => setFooterState('profile')}
        />
        <CgHome
          className="footer-icon"
          onClick={() => setFooterState('calendar')}
        />
        <CgMenu
          className="footer-icon"
          onClick={() => setFooterState('tasks')}
        />
      </footer>
    </div>
  );
}

export default App;
