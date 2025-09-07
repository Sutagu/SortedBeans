import defaultGuy from '../assets/images/portraits/defaultGuy.png';
import defaultBoy from '../assets/images/portraits/defaultBoy.webp';
import defaultGirl from '../assets/images/portraits/defaultGirl.png';
import defaultLady from '../assets/images/portraits/defaultLady.png';

const UserPortraits = () => {
  return (
    <span className="flex overflow-x-scroll noScrollBar rounded-2xl relative px-4">
      <img
        className="hover:scale-90 scale-75 transition-all"
        src={defaultGuy}
        alt="defaultGuy"
      />
      <img
        className="hover:scale-90 scale-75 transition-all"
        src={defaultBoy}
        alt="defaultBoy"
      />
      <img
        className="hover:scale-90 scale-75 transition-all"
        src={defaultGirl}
        alt="defaultGirl"
      />
      <img
        className="hover:scale-90 scale-75 transition-all"
        src={defaultLady}
        alt="defaultLady"
      />
    </span>
  );
};

export default UserPortraits;
