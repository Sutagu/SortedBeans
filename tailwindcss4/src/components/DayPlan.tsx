import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import React, { useEffect, useState } from 'react';
import DayTasks from './DayTasks';

const DayPlan: React.FC = () => {
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

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(
    currentDate.getDate()
  );

  function formatDate(date: Date): string {
    const year: number = date.getFullYear();
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    const day: string = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

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
      <div className="flex shadow-2xl shadow-accent-dark/50 justify-between items-center lg:my-[5%] p-[5%] border-y-1">
        <CgChevronLeft
          onClick={handlePrevDay}
          className="cursor-pointer hover:text-accent transition-colors"
        />
        <div>
          <div className="flex text-2xl font-bold gap-2">
            <div>{daysOfWeek[currentDayIndex]},</div>
            <div>{currentDate.getDate()}</div>
          </div>
          <div className="text-left text-xl font-semibold text-blend">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
        </div>
        <CgChevronRight
          onClick={handleNextDay}
          className="cursor-pointer hover:text-accent transition-colors"
        />
      </div>
      <DayTasks currentDate={formatDate(currentDate)} />
    </div>
  );
};

export default DayPlan;
