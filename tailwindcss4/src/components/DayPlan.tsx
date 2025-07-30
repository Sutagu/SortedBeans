import { AiOutlineRight } from 'react-icons/ai';
import { AiOutlineLeft } from 'react-icons/ai';
import React, { useEffect, useState } from 'react';
import DayTasks from './DayTasks';

interface DayPlanProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}

const DayPlan: React.FC<DayPlanProps> = ({ currentDate, setCurrentDate }) => {
  function formatDate(date: Date): string {
    const year: number = date.getFullYear();
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    const day: string = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const [currentDayIndex, setCurrentDayIndex] = useState<number>(
    currentDate.getDate()
  );

  const handlePrevDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDate);
  };
  useEffect(() => {
    setCurrentDayIndex(currentDate.getDay());
  }, [currentDate]);
  return (
    <div className="h-full">
      <div className="flex shadow-2xl justify-between items-center my-[5%] p-[5%] border-t-1 border-b-1">
        <AiOutlineLeft
          onClick={handlePrevDay}
          className="cursor-pointer hover:text-[#B85C38] transition-colors"
        />
        <div>
          <div className="flex text-2xl font-bold gap-2">
            <div>{daysOfWeek[currentDayIndex]},</div>
            <div className="text-[#B85C38]">{currentDate.getDate()}</div>
          </div>
          <div className="flex text-xl font-semibold text-[#bfbfbfa6]">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
        </div>
        <AiOutlineRight
          onClick={handleNextDay}
          className="cursor-pointer hover:text-[#B85C38] transition-colors"
        />
      </div>
      <DayTasks currentDate={formatDate(currentDate)} />
    </div>
  );
};

export default DayPlan;
