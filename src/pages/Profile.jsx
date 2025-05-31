import Logo from "../assets/Logo.png"
import BoyProfilePic from "../assets/BoyProfilePhoto.jpeg"
import GirlProfilePic from "../assets/GirlProfilePhoto.jpeg"
import LoginInput from "../components/LoginInput"
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Profile = () => {
    return (
        <div className="common-bg">
            <div className="login-bg p-[20px] md:p-[40px] lg:p-[70px] relative rounded-lg min-h-[300px] min-w-[400px] lg:min-h-[500px] lg:min-w-[1000px]">
                <div className="hidden lg:block absolute top-[10px] left-[20px]">
                    <img src={Logo} alt="Logo" className="w-[180px]" />
                </div>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 lg:col-span-6">
                        <div className="flex justify-center items-center min-h-[200px] w-full lg:min-h-[400px]">
                            <div className="relative w-[250px] h-[250px] rounded-[30px] border border-[#afd8f9] overflow-hidden mt-[10px] cursor-pointer group">
                                <img
                                    src={BoyProfilePic}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />

                                {/* Hover Overlay */}
                                <label className="cursor-pointer absolute inset-0 bg-[#d0d0d0]/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-gray-900 text-lg font-semibold">Upload Profile Photo</span>
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={(event) => console.log(event.target.files)}
                                        single
                                        accept="image/png, image/jpeg, image/webp"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                        <div className="flex flex-col justify-center gap-[3rem] min-h-[400px] w-full">
                            <div className="col-span-12">
                                <LoginInput disabled />
                            </div>
                            <div className="col-span-12">
                                <LoginInput placeholder="Username" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1"><LoginInput placeholder="First Name" /></div>
                                <div className="col-span-1"><LoginInput placeholder="Last Name" /></div>
                            </div>

                            {/*  will be implemented later if required

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <LoginInput type="date" placeholder="DOB" disabled />
                                </div>
                                <div className="col-span-1">
                                    <GenderToggleButton />
                                </div>
                            </div>

                            */}



                        </div>
                    </div>
                </div>
                <div className="flex justify-center gap-3">
                    <button className="p-[10px] px-[16px] cursor-pointer border-0 bg-[#d6e8ff] text-[#005498] rounded-md font-bold">Save Changes</button>
                    <button className="p-[10px] px-[16px] cursor-pointer border border-[#005498] bg-[#ffffff] text-[#005498] rounded-md font-bold"> Do It Later</button>
                </div>

            </div>
        </div>

    )
}

export default Profile
