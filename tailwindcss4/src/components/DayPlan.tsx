import { AiOutlineRight } from 'react-icons/ai';
import { AiOutlineLeft } from 'react-icons/ai';
import React, { useEffect, useState } from 'react';
import DayTasks from './DayTasks';

interface DayPlanProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  mainReloadTrigger: number;
  setMainReloadTrigger: React.Dispatch<React.SetStateAction<number>>;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  setPatchId: React.Dispatch<React.SetStateAction<number>>;
}
interface TaskFormData {
  title: string;
  est_time: number;
  category_id: number;
  assigned_date: string | null;
  description: string;
}
const DayPlan: React.FC<DayPlanProps> = ({
  currentDate,
  setCurrentDate,
  mainReloadTrigger,
  setMainReloadTrigger,
  setFormData,
  setPatchId,
}) => {
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
  }, [currentDate, mainReloadTrigger]);
  return (
    <div className="h-full">
      <div className="flex shadow-2xl justify-between items-center my-[5%] p-[5%] border-y-1">
        <AiOutlineLeft
          onClick={handlePrevDay}
          className="cursor-pointer hover:text-accent transition-colors"
        />
        <div>
          <div className="flex text-2xl font-bold gap-2">
            <div>{daysOfWeek[currentDayIndex]},</div>
            <div className="text-accent">{currentDate.getDate()}</div>
          </div>
          <div className="text-left text-xl font-semibold text-gray">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
        </div>
        <AiOutlineRight
          onClick={handleNextDay}
          className="cursor-pointer hover:text-accent transition-colors"
        />
      </div>
      <DayTasks
        currentDate={formatDate(currentDate)}
        reloadTrigger={mainReloadTrigger}
        setReloadTrigger={setMainReloadTrigger}
        setFormData={setFormData}
        setPatchId={setPatchId}
      />
    </div>
  );
};

export default DayPlan;
