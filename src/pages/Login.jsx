import { Button } from "@mui/material"
import AuthLayout from "../layouts/AuthLayout";
import LoginInput from "../components/LoginInput";
import { useState } from "react";



const Authentication = () => {


  const [loginState, setLoginState] = useState(true);


  const LogIn = () => {
    return (
      <div className="login-form">
        <div className="login-title mb-[30px]">
          <span>Log</span><span>in</span>
        </div>
        <div>
          <LoginInput placeholder="Email/Username"/>
        </div>
        <div>
          <LoginInput type="password" label="Password" placeholder="Password" />
        </div>
        <div className="flex flex-col lg:flex-row  justify-center lg:justify-between text-[#8e95a0] font-bold">
          <div className="cursor-pointer text-[0.8rem] text-center lg:text-left text-[#355382] hover:underline" onClick={() => { setLoginState(!loginState) }}>New User? Create Account</div>
          <div className="cursor-pointer text-[0.8rem] text-center lg:text-left hover:underline">Forgot Password?</div>
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
      </div>
    )
  }

  const SignUp = () => {
    return (
      <>
        <div className="login-form">
          <div className="login-title mb-[30px]">
            <span>Sign</span><span>up</span>
          </div>
          <div>
            <LoginInput label="Enter Email" placeholder="Email"/>
          </div>
          <div>
            <LoginInput type="password" label="New Password" placeholder="New password" />
          </div>
          <div>
            <LoginInput type="password" label="Confirm Password" placeholder="Confirm password" />
          </div>
          <div className="flex flex-col lg:flex-row  justify-center lg:justify-end text-[#8e95a0] font-bold">
            <div className="cursor-pointer text-[0.8rem] text-center lg:text-end text-[#355382] hover:underline" onClick={() => { setLoginState(!loginState) }}>Existing User? Sign In</div>
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
              Sign Up
            </Button>
          </div>
        </div>
      </>
    )
  }


  return (
    <>
      <AuthLayout>
        {loginState ? <LogIn /> : <SignUp />}
      </AuthLayout>
    </>
  )
}

export default Authentication

