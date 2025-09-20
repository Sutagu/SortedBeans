import defaultGuy from '../assets/images/portraits/defaultGuy.png';
import defaultBoy from '../assets/images/portraits/defaultBoy.png';
import defaultGirl from '../assets/images/portraits/defaultGirl.png';
import defaultLady from '../assets/images/portraits/defaultLady.png';

interface Prop {
  setPortraitPath: React.Dispatch<React.SetStateAction<string>>;
}

const UserPortraits = ({ setPortraitPath }: Prop) => {
  const handleChange = (newPath: string) => {
    setPortraitPath(newPath);
  };
  return (
    <span className="flex overflow-x-scroll noScrollBar rounded-2xl relative px-4">
      <img
        className="hover:scale-90 scale-75 transition-all"
        src={defaultGuy}
        alt="defaultGuy"
        onClick={() => handleChange('./defaultGuy.png')}
      />
      <img
        className="hover:scale-90 scale-75 transition-all"
        src={defaultBoy}
        alt="defaultBoy"
        onClick={() => handleChange('./defaultBoy.png')}
      />
      <img
        className="hover:scale-90 scale-75 transition-all"
        src={defaultGirl}
        alt="defaultGirl"
        onClick={() => handleChange('./defaultGirl.png')}
      />
      <img
        className="hover:scale-90 scale-75 transition-all"
        src={defaultLady}
        alt="defaultLady"
        onClick={() => handleChange('./defaultLady.png')}
      />
    </span>
  );
};

export default UserPortraits;
