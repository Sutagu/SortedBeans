import React from 'react';
interface Prop {
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  setCalendarTheme: React.Dispatch<React.SetStateAction<string>>;
}

const colours = [
  {
    name: 'default',
    theme: 'dark',
    dark: 'bg-[#2d2424]',
    primary: 'bg-[#5c3d2e]',
    secondary: 'bg-[#3c2a21]',
    accent: 'bg-[#b85c38]',
  },
  {
    name: 'cool-green',
    theme: 'dark',
    dark: 'bg-[#1a120b]',
    primary: 'bg-[#241914]',
    secondary: 'bg-[#3c2a21]',
    accent: 'bg-[#6b6752]',
  },
  {
    name: 'sunset-clay',
    theme: 'dark',
    dark: 'bg-[#3b2f2f]',
    secondary: 'bg-[#7a5241]',
    primary: 'bg-[#5a3e36]',
    accent: 'bg-[#f2a65a]',
  },
  {
    name: 'funk',
    theme: 'dark',
    dark: 'bg-[#151513]',
    primary: 'bg-[#43241b]',
    secondary: 'bg-[#854836]',
    accent: 'bg-[#ffb22c]',
  },
  {
    name: 'deep-ocean',
    theme: 'dark',
    dark: 'bg-[#0d1b2a]',
    secondary: 'bg-[#2a3f5f]',
    primary: 'bg-[#1b263b]',
    accent: 'bg-[#778da9]',
  },
  {
    name: 'pastel-sky',
    theme: 'light',
    dark: 'bg-[#4dd0e1]',
    primary: 'bg-[#b2ebf2]',
    secondary: 'bg-[#e0f7fa]',
    accent: 'bg-[#ffffff]',
  },
  {
    name: 'mint-latte',
    theme: 'light',
    dark: 'bg-[#c0e3d0]',
    secondary: 'bg-[#d6f0e0]',
    primary: 'bg-[#eefaf3]',
    accent: 'bg-[#a1e3b5]',
  },
  {
    name: 'blossom-pink',
    theme: 'light',
    dark: 'bg-[#f8c8d8]',
    secondary: 'bg-[#ffd6e0]',
    primary: 'bg-[#ffeef5]',
    accent: 'bg-[#ff8fab]',
  },
];

const ThemePallete = ({ setTheme, setCalendarTheme }: Prop) => {
  const themeChange = (theme: string, calendar: string) => {
    setTheme(theme);
    setCalendarTheme(calendar);
  };
  return (
    <span className="flex overflow-x-scroll gap-8 rounded-2xl relative px-4 bg-secondary">
      {colours.map((c) => (
        <span
          className="flex flex-col rounded-md ring-4 shadow-xl my-4 h-fit hover:cursor-pointer"
          key={c.name}
          onClick={() => themeChange(c.name, c.theme)}
        >
          <div className="h-30 relative">
            <div className={`rounded-t-md w-12 h-1/4 ${c.dark}`}></div>
            <div className={`grow h-1/4 ${c.primary}`}></div>
            <div className={` h-1/4 ${c.secondary}`}></div>
            <div className={`rounded-b-md h-1/4 ${c.accent}`}>.</div>
          </div>
        </span>
      ))}
    </span>
  );
};

export default ThemePallete;
