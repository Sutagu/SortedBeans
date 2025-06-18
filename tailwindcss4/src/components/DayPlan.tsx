import { AiOutlineRight } from "react-icons/ai"; 
import { AiOutlineLeft } from "react-icons/ai"; 
import React, { useEffect , useState} from "react";

interface DayPlanProps{
    currentDayIndex : number;
    setCurrentDayIndex : React.Dispatch<React.SetStateAction<number>>;
}

const DayPlan: React.FC<DayPlanProps> = ({currentDayIndex, setCurrentDayIndex}) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const[currentDate, setCurrentDate] = useState <number>(new Date().getDate());
    const handlePrevDay = () => {
        setCurrentDayIndex((prevDay) => (prevDay - 1 + daysOfWeek.length) % daysOfWeek.length);
        setCurrentDate(prevDate => prevDate - 1);
        
    }
    
    const handleNextDay = () => {
        setCurrentDayIndex((prevDay) => (prevDay +1)%daysOfWeek.length);
        setCurrentDate(prevDate => prevDate + 1);

    }
    useEffect(() =>{
        const today = new Date().getDate();
        setCurrentDayIndex((today%daysOfWeek.length)-1);
        setCurrentDate(today);
    },[])
    return(
        <div className="flex shadow-2xl justify-between items-center mt-[5%] p-[5%] border-t-1 border-b-1">
            <AiOutlineLeft onClick={handlePrevDay}/>
            <div>
            <div className="flex items-baseline text-2xl font-bold gap-2">
                <div>{daysOfWeek[currentDayIndex]},</div>
                <div className = "text-[#B85C38]">{currentDate}</div>
            </div>
            <div className="flex items-baseline text-xl font-bold gap-2">
                <div>{months[new Date().getMonth()]}</div>
                <div className = "text-[#bfbfbfa6]">{new Date().getFullYear()}</div>
            </div>
            </div>
            <AiOutlineRight onClick={handleNextDay} />
            <DayTasks currentDateIndex ={new Date().getLocale}/>
        </div>
    )
}


export default DayPlan