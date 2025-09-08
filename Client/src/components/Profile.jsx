import React, { useEffect, useState } from 'react'
import CustomModal from './CustomModal'
import { Camera, User, Mail, Phone, Edit3 } from 'lucide-react';
import { useSelector } from 'react-redux';

const Profile = ({ isOpen, onClose }) => {
    const user = useSelector(state => state?.user);

    const [data, setUserData] = useState(
        {
            email: "",
            userName: "",
            displayName: "",
            phoneNo: "",
            bio: ""
        }
    )
    const [profilePhoto, setProfilePhoto] = useState("");

    useEffect(() => {
        let userData = user?.userInfo;
        setUserData({
            email: userData?.email || "",
            userName: userData?.userName || "",
            displayName: userData?.displayName || "",
            phoneNo: userData?.phoneNo || "",
            bio: userData?.bio || ""
        })
    }, [user?.userInfo])


    useEffect(() => {
        if (user?.userProfilePicture) {
            setProfilePhoto(user?.userProfilePicture);
        }
    }, [user?.userProfilePicture])

        const closeModal = () => {
            console.log("getting triggered")
            onClose();
        }
        return (
            <>
                <CustomModal isOpen={isOpen} onClose={() => { closeModal(); }}>
                    <div
                        className="rounded-lg w-[1000px] min-h-[calc(100vh-80px)] bg-[#f1f1f1] p-[26px]"
                        style={{
                            boxShadow:
                                "#00549857 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                        }}
                    >
                        <div className="bg-gradient-to-r from-[#005498] to-[#0066b3] shadow-lg rounded-sm">
                            <div className="max-w-4xl mx-auto px-2 py-5 sm:px-6 lg:px-8">
                                <h1 className="text-md sm:text-xl font-bold text-[#fff] text-center">My Profile</h1>
                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                                <div className="relative bg-gradient-to-br from-[#005498]/5 to-[#005498]/10 px-3 py-4 sm:px-4 sm:py-6">
                                    <div className="flex flex-col items-center">
                                        <div className="relative group cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file && file.size > 5 * 1024 * 1024) {
                                                        alert('File size must be less than 5MB');
                                                        e.target.value = '';
                                                    } else {
                                                        setProfilePhoto(file);
                                                    }
                                                }}
                                            />
                                            {
                                                !profilePhoto &&
                                                <div className="w-34 h-34 sm:w-40 sm:h-40 rounded-4xl bg-gradient-to-br from-[#005498] to-[#0066b3] flex items-center justify-center shadow-lg">
                                                    <User className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                                                </div>
                                            }
                                            {
                                                profilePhoto &&
                                                <div className="w-34 h-34 sm:w-40 sm:h-40 rounded-4xl bg-transparent flex items-center justify-center shadow-lg overflow-hidden">
                                                    <img
                                                        src={profilePhoto}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            }

                                            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="text-white text-xs sm:text-sm font-medium text-center px-2">
                                                    Upload Profile Picture
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 sm:px-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                                        <div className="space-y-1">
                                            <label className="flex items-center text-sm font-semibold text-[#005498] mb-3">
                                                <Mail className="w-4 h-4 mr-2 text-[#005498]" />
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                value={data?.email}
                                                disabled
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md 
                                                    text-[#005498] placeholder-[#005498]/40 transition-all duration-200
                                                    focus:border-[#005498] focus:outline-none focus:ring-0
                                                    disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-300"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="flex items-center text-sm font-semibold text-[#005498] mb-3">
                                                <User className="w-4 h-4 mr-2 text-[#005498]" />
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter username"
                                                value={data?.userName}
                                                onChange={(e) =>
                                                    setUserData((prev) => ({
                                                        ...prev,
                                                        userName: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-[#005498] placeholder-[#005498]/40 transition-all duration-200
                                                            focus:border-[#005498] focus:outline-none focus:ring-0"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="flex items-center text-sm font-semibold text-[#005498] mb-3">
                                                <Edit3 className="w-4 h-4 mr-2 text-[#005498]" />
                                                Display Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter display name"
                                                value={data?.displayName}
                                                onChange={(e) =>
                                                    setUserData((prev) => ({
                                                        ...prev,
                                                        displayName: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-[#005498] placeholder-[#005498]/40 transition-all duration-200
                                                            focus:border-[#005498] focus:outline-none focus:ring-0"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="flex items-center text-sm font-semibold text-[#005498] mb-3">
                                                <Phone className="w-4 h-4 mr-2 text-[#005498]" />
                                                Phone Number
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Enter phone number"
                                                value={data?.phoneNo}
                                                onChange={(e) =>
                                                    setUserData((prev) => ({
                                                        ...prev,
                                                        phoneNo: e.target.value,
                                                    }))
                                                }
                                                min={10}
                                                max={10}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-[#005498] placeholder-[#005498]/40 transition-all duration-200
                                                        focus:border-[#005498] focus:outline-none focus:ring-0
                                                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                        </div>

                                        <div className="lg:col-span-2 space-y-1">
                                            <label className="flex items-center text-sm font-semibold text-[#005498] mb-3">
                                                <Edit3 className="w-4 h-4 mr-2 text-[#005498]" />
                                                Bio
                                            </label>
                                            <textarea
                                                rows="4"
                                                value={data?.bio}
                                                onChange={(e) =>
                                                    setUserData((prev) => ({
                                                        ...prev,
                                                        bio: e.target.value,
                                                    }))
                                                }
                                                placeholder="Tell us about yourself..."
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-[#005498] placeholder-[#005498]/40 transition-all duration-200
                                                            focus:border-[#005498] focus:outline-none focus:ring-0"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-4 pt-6 border-t border-gray-100">
                                        <button className="bg-[#005498] hover:bg-[#004080] cursor-pointer text-white font-semibold py-3 px-8 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => onClose()}
                                            className="bg-white cursor-pointer hover:bg-[#005498]/5 text-[#de0505] font-semibold py-3 px-8 rounded-md border-2 border-[#de0505] transition-all duration-200 hover:shadow-md ml-4"
                                        >
                                            Exit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CustomModal>
            </>
        )
    }

export default Profile
