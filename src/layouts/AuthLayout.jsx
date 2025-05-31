import LogIn from "../assets/Designer.png"
import Logo from "../assets/Logo.png"

const AuthLayout = ({children}) => {
  return (
    <>
      <div className="common-bg">
        <div className="login-bg relative flex flex-col lg:flex-row h-auto p-[40px] sm:p-[20px] md:p-[40px] lg:p-[80px] xl:p-[100px] lg:min-w-[1000px] xl:min-w-[1400px] w-auto ">
          <div className="hidden lg:block absolute top-[10px] left-[20px]">
            <img src={Logo} alt="Logo" className="w-[180px]" />
          </div>
          {/* Image section */}
          <div className="hidden lg:block w-full lg:w-7/12">
            <div className="login-img">
              <img src={LogIn} alt="login" />
            </div>
          </div>

          {/* Form section */}
          <div className="w-full lg:w-5/12">
            {children}
          </div>

        </div>
      </div>
    </>
  )
}

export default AuthLayout
