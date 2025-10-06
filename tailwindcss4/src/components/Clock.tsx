import React, { useEffect, useState } from 'react';
const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>(() => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  });
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <p className="text-xl self-center w-3/4  lg:text-xl max-sm:border-b-2 lg:border-b-2 pb-2 sm:max-lg:border-r-2">
      {currentTime}
    </p>
  );
};
export default Clock;
