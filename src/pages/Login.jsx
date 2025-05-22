import { Input } from "@mui/material"
import { InputLabel } from '@mui/material';
import LogIn from "../assets/Designer.png"


const Login = () => {
  return (
    <>
      <div className="common-bg">
        <div className="login-bg flex flex-col lg:flex-row h-auto sm:p-[20px] md:p-[40px] lg:p-[80px] xl:p-[100px] lg:min-w-[1000px] xl:min-w-[1400px] w-auto">

          {/* Image section */}
          <div className="w-full lg:w-7/12">
            <div className="login-img">
              <img src={LogIn} alt="login" />
            </div>
          </div>

          {/* Form section */}
          <div className="w-full lg:w-5/12">
            <div className="login-form">
              <div className="login-title mb-[30px]">
                <span>Log</span><span>in</span>
              </div>
              <div>
              <InputLabel>Email</InputLabel>
              <Input className="w-full"/>
              </div>
              <div><Input className="w-full"/></div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Login
