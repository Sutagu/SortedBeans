import { AiOutlineRight } from 'react-icons/ai';
import { AiOutlineLeft } from 'react-icons/ai';
import defaultGuy from '../assets/images/portraits/defaultGuy.png';
import defaultBoy from '../assets/images/portraits/defaultBoy.png';
import defaultGirl from '../assets/images/portraits/defaultGirl.png';
import defaultLady from '../assets/images/portraits/defaultLady.png';
import React, { useRef } from 'react';
interface Prop {
  setPortraitPath: React.Dispatch<React.SetStateAction<string>>;
}

const UserPortraits = ({ setPortraitPath }: Prop) => {
  const sliderRef = useRef<HTMLSpanElement>(null);
  const scrollAmount = 100;

  const handleChange = (newPath: string) => {
    setPortraitPath(newPath);
  };
  return (
    <div className=" pl-4 flex w-fit h-full relative">
      <AiOutlineLeft
        className="absolute z-99 h-full rounded-l-xl bg-accent-dark/20 text-text hover:bg-accent-dark/50 hover:cursor-pointer"
        onClick={() => {
          const container = sliderRef.current;
          if (container) container.scrollLeft -= scrollAmount;
        }}
      />
      <span
        className="flex overflow-x-scroll noScrollBar rounded-2xl transition-all scroll-smooth"
        ref={sliderRef}
      >
        <img
          className="hover:scale-90 scale-75"
          src={defaultGuy}
          alt="defaultGuy"
          onClick={() => handleChange('./defaultGuy.png')}
        />
        <img
          className="hover:scale-90 scale-75"
          src={defaultBoy}
          alt="defaultBoy"
          onClick={() => handleChange('./defaultBoy.png')}
        />
        <img
          className="hover:scale-90 scale-75 "
          src={defaultGirl}
          alt="defaultGirl"
          onClick={() => handleChange('./defaultGirl.png')}
        />
        <img
          className="hover:scale-90 scale-75 "
          src={defaultLady}
          alt="defaultLady"
          onClick={() => handleChange('./defaultLady.png')}
        />
      </span>
      <AiOutlineRight
        className="absolute right-0 z-99 h-full rounded-r-xl bg-accent-dark/20 text-text hover:bg-accent-dark/50 hover:cursor-pointer"
        onClick={() => {
          const container = sliderRef.current;
          if (container) container.scrollLeft += scrollAmount;
        }}
      />
    </div>
  );
};

export default UserPortraits;
