import React, {useEffect, useState} from 'react';
const Clock: React.FC = () => {
  const[currentTime, setCurrentTime] = useState<string>(() =>{
    return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  });
  useEffect(() =>{
    const timer = setInterval(() =>{
      setCurrentTime(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return <p>{currentTime}</p>
};
export default Clock;