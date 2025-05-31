import Logo from "../assets/Logo.png"

const Header = () => {
  return (
    <div className='px-[12px] py-[10px] bg-[#ffffff]'>
      <img src={Logo} className="h-[30px] w-[100px] ml-[5px]"/>
    </div>
  )
}

export default Header
