import Logo from "../assets/Logo.svg"
import BoyProfilePic from "../assets/BoyProfilePhoto.jpeg"
import GirlProfilePic from "../assets/GirlProfilePhoto.jpeg"
import LoginInput from "../components/LoginInput"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const Profile = () => {
    return (
        <div className="common-bg">
            <div className="login-bg p-[20px] md:p-[40px] lg:p-[70px] relative rounded-lg min-h-[300px] min-w-[400px] lg:min-h-[600px] lg:min-w-[1200px]">
                <div className="hidden lg:block absolute top-[10px] left-0">
                    <img src={Logo} alt="Logo" className="w-[180px]" />
                </div>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 lg:col-span-5">
                        <div className="flex justify-center items-center min-h-[200px] w-full lg:min-h-[400px]">
                            <div className="relative w-[250px] h-[250px] rounded-[30px] border border-[#afd8f9] overflow-hidden mt-[40px] cursor-pointer group">
                                <img
                                    src={BoyProfilePic}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-[#d0d0d0]/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-gray-900 text-lg font-semibold">Upload Profile Photo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-7">
                        <div className="flex flex-col gap-3 justify-evenly min-h-[400px] w-full">
                            <div className="col-span-12">
                                <LoginInput disabled />
                            </div>
                            <div className="col-span-12">
                                <LoginInput placeholder="Username" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div col-span-6><LoginInput placeholder="First Name" /></div>
                                <div col-span-6><LoginInput placeholder="Last Name" /></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div col-span-6>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker label="Basic date picker" />
                                    </LocalizationProvider>

                                </div>
                                <div col-span-6></div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Profile
