import React from "react";
import dayTasksData from "../assets/data/dayTasksData.json";
import Line from "../assets/images/bg/line.png";

interface DayTasksProps{
    dateIndex : string;
    tasks: string[];
}

const DayTasks : React.FC<{currentDateIndex: string}> = ({currentDateIndex}) =>{
    const tasksForDay = (dayTasksData as DayTasksProps[]).find(
        (day) => day.dateIndex === currentDateIndex
        
    )?.tasks || [];
    const colours = ["#2196A8", "#D6453D", "#F5A623", "#3FA34D"];
    return (
        <div>
            
            <ul className="flex flex-col p-[5%] gap-10 text-[#F7F7F7] items-center ">
                {tasksForDay.map((task, idx)=> 
                <li className="w-full text-left font-medium flex gap-6 items-center"  key={idx}>
                    <img className="h-3" src={Line}/>
                    <div className = "w-[75%] p-[5%] rounded-xl text-xl" style={{backgroundColor : colours[idx % colours.length]}}>
                    {task}
                    </div>
                    </li>)}
            </ul>
        </div>
    );
};

export default DayTasks;