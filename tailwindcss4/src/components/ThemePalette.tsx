import React from 'react';
interface Prop {
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

const colours = [
  {
    name: 'default',
    dark: '[bg-#2d2424]',
    primary: 'bg-[#5c3d2e]',
    secondary: 'bg-[#3c2a21]',
    accent: 'bg-[#b85c38]',
  },
  {
    name: 'cool-green',
    dark: '[bg-#1a120b]',
    primary: 'bg-[#241914]',
    secondary: 'bg-[#3c2a21]',
    accent: 'bg-[#e5e5cb]',
  },
  {
    name: 'funk',
    dark: '[bg-#151513]',
    primary: 'bg-[#43241b]',
    secondary: 'bg-[#854836]',
    accent: 'bg-[#ffb22c]',
  },
];

const ThemePallete = ({ setTheme }: Prop) => {
  const themeChange = (theme: string) => {
    setTheme(theme);
  };
  return (
    <span className="flex w-full justify-between">
      {colours.map((c) => (
        <span className="flex" key={c.name} onClick={() => themeChange(c.name)}>
          <div className={`w-2 ${c.dark}`}></div>
          <div className={c.primary}></div>
          <div className={c.secondary}></div>
          <div className={c.accent}></div>
        </span>
      ))}
    </span>
  );
};

export default ThemePallete;
