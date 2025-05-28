import { Input, InputAdornment, IconButton } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';

const LoginInput = ({ label = "Email/Username", type = "text", placeholder = "Enter your email/username" }) => {
    return (
        <>
            <label className="text-[#515050] text-sm font-semibold mb-[6px]">
                {label}
            </label>
            {
                type === "text" ? <InputText placeholder={placeholder} /> : <InputPassword placeholder={placeholder} />
            }

        </>
    )
}

export default LoginInput


const InputText = ({ placeholder }) => {
    return (
        <>
            <Input className="w-full custom-login-input shadow-[0px_3px_8px_rgba(127,157,219,0.24)]"
                type={"text"}
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
                placeholder={placeholder}

            />
        </>
    )
}


const InputPassword = ({ placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword((prev) => !prev);


    return (
        <>
            <Input className="w-full custom-login-input shadow-[0px_3px_8px_rgba(127,157,219,0.24)]"
                type={showPassword ? "text" : "password"}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton onClick={toggleShowPassword} edge="end" className="text-xs">
                            {showPassword ? <VisibilityOff sx={{ fontSize: "16px" }} /> : <Visibility sx={{ fontSize: "16px" }} />}
                        </IconButton>
                    </InputAdornment>
                }
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
                placeholder={placeholder}

            />
        </>
    )
}
