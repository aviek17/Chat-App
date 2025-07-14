import { useSelector } from "react-redux";
import Logo from "../assets/Logo_Nobg.png";

const Header = () => {
  const menuState = useSelector((state) => state.navigation?.menuDrawerState);

  return (
    <div className="px-[12px] py-[10px] bg-[#f3f3f3]">
      {menuState ? (
        <div className="h-[30px] w-[100px] ml-[5px]" />
      ) : (
        <img src={Logo} alt="Logo" className="h-[30px] w-[100px] ml-[5px]" />
      )}
    </div>
  );
};

export default Header;
