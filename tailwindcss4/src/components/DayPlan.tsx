import { AiOutlineRight } from "react-icons/ai"; 
import { AiOutlineLeft } from "react-icons/ai"; 
import React, { useEffect , useState} from "react";
import DayTasks from "./DayTasks";

interface DayPlanProps{
    currentDate : Date;
    setCurrentDate : React.Dispatch<React.SetStateAction<Date>>;
}

const DayPlan: React.FC<DayPlanProps> = ({currentDate, setCurrentDate}) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const options : Intl.DateTimeFormatOptions = { 
        month: '2-digit',  // keeps leading zero: 06
        day: '2-digit',    // keeps leading zero: 19
        year: 'numeric'    // full year: 2025
    };
    
    const[currentDayIndex, setCurrentDayIndex] = useState<number>(currentDate.getDate());
    // const[currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    // const[currentYear, setCurrentYear] = useState(currentDate.getFullYear());

    const handlePrevDay = () => {
        const prevDate = new Date(currentDate);
        prevDate.setDate(currentDate.getDate()-1);
        setCurrentDate(prevDate);

    }
    
    const handleNextDay = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate()+1);
        setCurrentDate(nextDate);


    }
    useEffect(() =>{
        const today = new Date().getDate();
        setCurrentDayIndex((today%daysOfWeek.length)-1);
    },[])
    return(
        <div>
        <div className="flex shadow-2xl justify-between items-center mt-[5%] mb-[5%] p-[5%] border-t-1 border-b-1">
            <AiOutlineLeft onClick={handlePrevDay}/>
            <div>
            <div className="flex items-baseline text-2xl font-bold gap-2">
                <div>{daysOfWeek[currentDayIndex]},</div>
                <div className = "text-[#B85C38]">{currentDate.getDate()}</div>
            </div>
            <div className="flex items-baseline text-xl font-bold gap-2">
                <div>{months[new Date().getMonth()]}</div>
                <div className = "text-[#bfbfbfa6]">{new Date().getFullYear()}</div>
            </div> 
            </div>
            <AiOutlineRight onClick={handleNextDay} />
        </div>
            <DayTasks currentDateIndex ={currentDate.toLocaleDateString('en-US', options)}/>

            
        </div>
    )
}


export default DayPlan