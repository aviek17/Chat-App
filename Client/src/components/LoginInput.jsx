import { Input, InputAdornment, IconButton } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


const LoginInput = ({ type = "text", placeholder = "Enter your email/username", disabled = false }) => {
    return (
        <>

            {/*<label className="text-[#515050] text-sm font-semibold mb-[6px]">
                {label}
            </label>*/}
            {
                type === "text" && <InputText placeholder={placeholder} disabled={disabled} />
            }
            {
                type === "password" && <InputPassword placeholder={placeholder} disabled={disabled} />
            }
            {
                type === "date" && <InputDate placeholder={placeholder} disabled={disabled} />
            }

        </>
    )
}

export default LoginInput


const InputText = ({ placeholder, disabled }) => {
    return (
        <>
            <Input className="w-full custom-login-input shadow-[0px_3px_8px_rgba(127,157,219,0.24)]"
                type={"text"}
                disabled={disabled}
                sx={{
                    '&::before': {
                        borderBottom: 'none',
                    },
                    '&:hover:not(.Mui-disabled):not(.Mui-error)::before': {
                        borderBottom: 'none',
                    },
                    '&.Mui-disabled::before': {
                        borderBottom: 'none',
                    },
                    backgroundColor: '#0764af21',
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

const InputDate = ({ placeholder, disabled }) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    }
    return (
        <>
            <Input className="w-full custom-login-input shadow-[0px_3px_8px_rgba(127,157,219,0.24)]"
                type={"text"}
                disabled={disabled}
                sx={{
                    '&::before': {
                        borderBottom: 'none',
                    },
                    '&:hover:not(.Mui-disabled):not(.Mui-error)::before': {
                        borderBottom: 'none',
                    },
                    '&.Mui-disabled::before': {
                        borderBottom: 'none',
                    },
                    backgroundColor: '#0764af21',
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
                endAdornment={
                    <InputAdornment position="end">
                        <CalendarTodayIcon onClick={() => { setOpen(true) }} sx={{ color: '#a5a0a096', cursor: 'pointer', fontSize: "16px" }} />
                    </InputAdornment>
                }
            />

            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDatePicker
                            maxDate={dayjs()}
                            sx={{
                                '.MuiPickersDay-root': {
                                    color: '#005498',
                                    borderRadius: '14px',
                                    borderWidth: '1px',
                                    borderColor: '#2196f3',
                                    border: '1px solid',
                                    backgroundColor: '#ddf0ff',
                                },
                                '.MuiPickersDay-root.Mui-disabled:not(.Mui-selected)': {
                                    backgroundColor: '#e0e0e0', 
                                    color: '#9e9e9e',          
                                    border: 'none',
                                },
                            }}
                            slotProps={{
                                actionBar: {
                                    actions: [],
                                },
                            }}
                        />
                    </LocalizationProvider>
                    <div className='flex justify-center gap-3'>
                        <Button onClick={handleClose}>OK</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </div>
                </DialogContent>

            </Dialog>
        </>
    )
}


const InputPassword = ({ placeholder, disabled }) => {
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
                    '&.Mui-disabled::before': {
                        borderBottom: 'none',
                    },
                    '&:hover:not(.Mui-disabled):not(.Mui-error)::before': {
                        borderBottom: 'none',
                    },
                    backgroundColor: '#0764af21',
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
                disabled={disabled}
            />
        </>
    )
}
