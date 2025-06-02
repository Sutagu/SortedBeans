
import { BsFillGearFill } from "react-icons/bs"; 
import './App.css'
import portrait from './assets/images/portraits/standardguy1.png';
import Clock from './components/Clock';
import WeatherTemp from './components/WeatherTemp';



function App() {
  return (
    <div className="w-screen h-screen grid grid-cols-3">
      
      <div className='outerContainer flex flex-col gap-[5%]<BsFillGearFill />'>
        <div className='innerContainer h-[50%] mt-[10%] grid grid-cols-2 grid-rows-[10%_40%_10%_40%] p-[5%]'>
        <div className="text-left text-xm self-start">SORTED BEANS</div>
        <BsFillGearFill className="ml-auto text-xm self-start" />

        <img src={portrait} alt="Portrait" className="portrait bg-[#B85C38] h-[100%] rounded-2xl shadow-inner"/>
        <div className="flex flex-col justify-center vertical-align">
          <Clock />
          <WeatherTemp/>
        </div>

        <div className="bg-green-300 col-span-2">Row 3 (merged)</div>

        <div className="bg-yellow-300 col-span-2">Row 4 (merged)</div>
        </div>
        <div className='innerContainer h-[30%]'></div>
      </div>
      <div className='outerContainer'>
        <div className="innerContainer h-[85%] w-[100%]! mt-[10%]"></div>
      </div>
      <div className='outerContainer'>
        <div className="innerContainer h-[85%] mt-[10%]"></div>
      </div>
      
    </div>
  );
}

export default App;

