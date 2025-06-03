import { useSelector } from "react-redux";
import Logo from "../assets/Logo.png";

const Header = () => {
  const menuState = useSelector((state) => state.navigationState?.menuDrawerState);

  return (
    <div className="px-[12px] py-[10px] bg-[#ffffff]">
      {menuState ? (
        <div className="h-[30px] w-[100px] ml-[5px]" />
      ) : (
        <img src={Logo} alt="Logo" className="h-[30px] w-[100px] ml-[5px]" />
      )}
    </div>
  );
};

export default Header;
