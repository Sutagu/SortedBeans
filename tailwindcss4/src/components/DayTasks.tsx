import React from "react";
import { useState, useEffect } from "react";
import Line from "../assets/images/bg/line.png";


interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  est_time: number;
  category_id: number;
  assigned_date: string | null;
}
//test to see if it updates the commit after merge
const DayTasks : React.FC<{currentDateIndex: string}> = ({currentDateIndex}) =>{
    console.log("Current date index:",currentDateIndex);
    const [tasks, setTasks] = useState<Task[]>([]);
      useEffect(() => {
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/api/tasks');
    const data = await res.json();
    setTasks(data);
  };

  fetchTasks();
}, [currentDateIndex]);
    const task58 = (tasks.find(task => task.id === 104));
    const taskTest = (tasks.find(task => task.assigned_date && task.assigned_date.slice(0,10) === '2025-07-12'));
    console.log("Tasks assigned: ",task58);
    console.log("TasksTest assigned: ", taskTest);

    const colours = ["#2196A8", "#D6453D", "#F5A623", "#3FA34D"];
    return (   
            <ul className="p-5 text-[#F7F7F7] h-[70%] max-h-[70%] overflow-y-auto noScrollBar">
                {tasks
                .filter(task => task.assigned_date && task.assigned_date.slice(0,10) === currentDateIndex)
                .map((task, idx)=> 
                <li className="w-full text-left font-medium flex gap-6 items-center py-4"  key={idx}>
                    <img className="h-3" src={Line}/>
                    <div className = "w-[75%] p-[5%] rounded-xl " style={{backgroundColor : colours[idx % colours.length]}}>
                      <div className="flex justify-between">
                        <span className="text-xl">{task.title}</span><span>{task.est_time}</span>
                      </div>
                      <div></div>
                    
                    </div>
                    </li>)}
            </ul>
    );
}; 

export default DayTasks;