import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import defaultGuy from '../assets/images/portraits/defaultGuy.webp';
import defaultBoy from '../assets/images/portraits/defaultBoy.webp';
import defaultGirl from '../assets/images/portraits/defaultGirl.webp';
import defaultLady from '../assets/images/portraits/defaultLady.webp';
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
      <CgChevronLeft
        className="absolute z-99 h-full rounded-l-xl bg-accent text-text hover:bg-accent-dark/50 hover:cursor-pointer"
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
          loading="lazy"
          alt="defaultGuy"
          onClick={() => handleChange('./defaultGuy.webp')}
        />
        <img
          className="hover:scale-90 scale-75"
          src={defaultBoy}
          loading="lazy"
          alt="defaultBoy"
          onClick={() => handleChange('./defaultBoy.webp')}
        />
        <img
          className="hover:scale-90 scale-75 "
          src={defaultGirl}
          loading="lazy"
          alt="defaultGirl"
          onClick={() => handleChange('./defaultGirl.webp')}
        />
        <img
          className="hover:scale-90 scale-75 "
          src={defaultLady}
          loading="lazy"
          alt="defaultLady"
          onClick={() => handleChange('./defaultLady.webp')}
        />
      </span>
      <CgChevronRight
        className="absolute right-0 z-99 h-full rounded-r-xl bg-accent text-text hover:bg-accent-dark/50 hover:cursor-pointer"
        onClick={() => {
          const container = sliderRef.current;
          if (container) container.scrollLeft += scrollAmount;
        }}
      />
    </div>
  );
};

export default UserPortraits;
