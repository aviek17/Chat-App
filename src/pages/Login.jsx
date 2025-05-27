import { Button, Input } from "@mui/material"
import { InputLabel } from '@mui/material';
import LogIn from "../assets/Designer.png"
import Logo from "../assets/Logo.svg"


const Login = () => {
  return (
    <>
      <div className="common-bg">
        <div className="login-bg relative flex flex-col lg:flex-row h-auto p-[40px] sm:p-[20px] md:p-[40px] lg:p-[80px] xl:p-[100px] lg:min-w-[1000px] xl:min-w-[1400px] w-auto ">
          <div className="hidden lg:block absolute top-[10px] left-0">
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
            <div className="login-form">
              <div className="login-title mb-[30px]">
                <span>Log</span><span>in</span>
              </div>
              <div>
                <LoginInput />
              </div>
              <div>
                <LoginInput />
              </div>
              <div className="flex flex-col lg:flex-row  justify-center lg:justify-between text-[#8e95a0] font-bold">
                <div className="cursor-pointer text-center lg:text-left text-[#355382]">Create Account</div>
                <div className="cursor-pointer text-center lg:text-left">Forgot Password?</div>
              </div>
              <div>
                <Button variant="contained" color="#434582" fullWidth
                  sx={{
                    backgroundColor: '#434582',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#2f315d',
                    },
                    borderRadius: '6px',
                    fontWeight: '600',
                  }}>
                  Sign In
                </Button>
              </div>
              {/*
              <div className="text-center text-[#4c4c4d]">
                --- OR ---
              </div>
              <div>
                <Button variant="contained" color="#434582" fullWidth
                  sx={{
                    backgroundColor: '#fff',
                    color: '#056498',
                    '&:hover': {
                      backgroundColor: '#056498',
                      color: "#fff"
                    },
                    paddingY: "10px",
                    borderRadius: '6px',
                    fontWeight: '600',
                  }}>
                  Google Sign In
                </Button>
              </div>
              */}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Login



const LoginInput = () => {
  return <>
    <InputLabel>Password</InputLabel>
    <Input className="w-full custom-login-input shadow-[0px_3px_8px_rgba(127,157,219,0.24)]"
      type="password"
      sx={{
        '&::before': {
          borderBottom: 'none',
        },
        '&:hover:not(.Mui-disabled):not(.Mui-error)::before': {
          borderBottom: 'none',
        },
        backgroundColor: '#f0f1ff',
        border: 'none',
        '&.Mui-focused': {
          backgroundColor: 'transparent',
          border: '1px solid #7f9ddb'
        },
        boxShadow: '0px 3px 8px rgba(127, 157, 219, 0.24)',
        color: '#000',
        fontWeight: 600,
        '& input::placeholder': {
          color: '#a5a0a096',
          opacity: 1,
        },
      }}
      placeholder="Enter your password"

    />
  </>
}
