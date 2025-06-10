import { AiOutlineRight } from "react-icons/ai"; 
import { AiOutlineLeft } from "react-icons/ai"; 
import React, { useEffect } from "react";
interface DayPlanProps{
    currentDayIndex : number;
    setCurrentDayIndex : React.Dispatch<React.SetStateAction<number>>;
}

const DayPlan: React.FC<DayPlanProps> = ({currentDayIndex, setCurrentDayIndex}) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const handlePrevDay = () => {
        setCurrentDayIndex((prevDay) => (prevDay-1)%daysOfWeek.length);
    }

    const handleNextDay = () => {
        setCurrentDayIndex((prevDay) => (prevDay +1)%daysOfWeek.length);

    }
    useEffect(() =>{
        const today = new Date().getDate();
        setCurrentDayIndex(today%daysOfWeek.length);

    },[])
    return(
        <div className="flex justify-between mt-[5%] p-[5%] border-t-1 border-b-1">
            <AiOutlineLeft onClick={handlePrevDay}/>
            <div>{daysOfWeek[currentDayIndex]}</div>
            <AiOutlineRight onClick={handleNextDay} />
        </div>
    )
}


export default DayPlan