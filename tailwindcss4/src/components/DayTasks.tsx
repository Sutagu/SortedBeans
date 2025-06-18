import React from "react";
import dayTasksData from "../assets/data/dayTasksData.json";
interface DayTasksProps{
    dateIndex : number;
    tasks: string[];
}

const DayTasks : React.FC<{currentDateIndex: number}> = ({currentDateIndex}) =>{
    const tasksForDay = (dayTasksData as DayTasksProps[]).find(
        (day) => day.dateIndex === currentDateIndex
    )?.tasks || [];

    return (
        <div>
            <h2>Tasks for Day {currentDateIndex}</h2>
            <ul>
                {tasksForDay.map((task, idx)=> <li key={idx}>{task}</li>)}
            </ul>
        </div>
    );
};

export default DayTasks;