

import './App.css'
import React, {useState} from 'react'
//Top left
import { BsFillGearFill } from "react-icons/bs"; 
import portrait from './assets/images/portraits/standardguy1.png';
import Clock from './components/Clock';
import WeatherTemp from './components/WeatherTemp';
import GitHubCalendar from "react-github-calendar";

//Bottom left
import logo from './assets/images/logo/logoTpLarge.png';
import Quotes from './components/Quotes';

//Middle
import DayPlan from './components/DayPlan';

//right
import TaskCategorySelector from './components/taskCategorySelector';
import TaskList from './components/TaskList';

function App() {
  const [category, setCategory] = useState<string>('Tasks');
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(new Date().getDate());  
  
  
  return (
    <div className="w-screen h-screen grid grid-cols-3">
      
      <div className='outerContainer flex flex-col gap-[5%] <BsFillGearFill />'>
        <div className='innerContainer h-[50%] mt-[10%] grid grid-cols-2 grid-rows-[10%_40%_10%_40%] p-[5%]'>
        <div className="text-left text-xm self-start">SORTED BEANS</div>
        <BsFillGearFill className="ml-auto text-xm self-start" />

        <img src={portrait} alt="Portrait" className="portrait bg-[#B85C38] h-[100%] rounded-2xl shadow-inner"/>
        <div className="flex flex-col justify-center vertical-align">
          <Clock />
          <WeatherTemp/>
        </div>

        <div className="flex col-span-2 gap-[1%] text-lg font-semibold"> 
          <div className="record-string text-[#B85C38]">25 </div>
          <div className="record-string">Days Consistent 🔥</div>
        </div>

        <div className="col-span-2 bg-[#87462C] p-[5%] rounded-xl shadow-xl">
          <GitHubCalendar 
          username="Sutagu"
          theme={{
              light : ['#5C3D2E', '#c6e48b', '#E0C097', '#b39a79', '#9d866a']
          }}
          colorScheme="light"
          />
        </div>
        </div>
        <div className='innerContainer h-[30%] bg-[url(assets/images/bg/dessert.jpg)] bg-cover relative'>
          <img src={logo} alt="logo" className="w-[10%] absolute left-5 bottom-5" />
          <Quotes />
        </div>
      </div>
      <div className='outerContainer'>
        <div className="innerContainer h-[85%] w-[100%]! mt-[10%] rounded-none!">
            <DayPlan 
            currentDayIndex={currentDayIndex}
            setCurrentDayIndex={setCurrentDayIndex}
            />
        </div>
      </div>
      <div className='outerContainer'>
        <div className="innerContainer h-[85%] mt-[10%] text-[#FFF0DC] bg-[#4c352b]!">
          <p className="text-left bg-[#894931] rounded-t-xl p-[2%] max-h-[5%] h-[5%] text-sm">Create Drag Drop your Tasks!</p>
          <TaskCategorySelector selected={category} onChange={setCategory} />
          <TaskList category={category}/>
        </div>
      </div>
      
    </div>
  );
}

export default App;

