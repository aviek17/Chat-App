import React, { useEffect, useState } from 'react'
import CustomModal from './CustomModal'
import { Camera, User, Mail, Phone, Edit3 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, updateProfilePic } from '../services/user.service';
import { API_USER } from '../utils/constants/api.constants';
import { setProfilePhotoFileName, setUserInfo } from '../store/slice/userInfoSlice';
import { getBase64FromFile, getBase64FromUrl } from '../services/common.service';


const Profile = ({ isOpen, onClose }) => {
    const user = useSelector(state => state?.user);
    const dispatch = useDispatch();

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

    const closeModal = () => {
        console.log("getting triggered")
        onClose();
    }

    const uploadProfilePicture = async file => {
        if (!file.type.startsWith("image/")) {
            alert("Cannot upload this image");
            return;
        }
        const formData = new FormData();
        formData.append("profilePicture", file);
        const res = await updateProfilePic(formData);
        dispatch(setProfilePhotoFileName(res.filename));
        const base64Image = await getBase64FromFile(res.filename);
        setProfilePhoto(base64Image);
    }

    const updateProfilePicture = async () => {
        if (user?.userProfilePicture) {
            const base64Image = await getBase64FromFile(user?.userProfilePicture);
            setProfilePhoto(base64Image);
        }
    }

    const saveProfileData = async () => {
        const responseData = await updateProfile(data);
        dispatch(setUserInfo(responseData.user));
        onClose();
    }

    useEffect(() => {
        let userData = user?.userInfo;
        setUserData({
            email: userData?.email || "",
            userName: userData?.userName || "",
            displayName: userData?.displayName || "",
            phoneNo: userData?.phoneNo || "",
            bio: userData?.bio || "",
            uid: userData?.uid || ""
        })
        updateProfilePicture();
    }, [user?.userInfo])


    useEffect(() => {
        if (user?.userProfilePicture) {
            setProfilePhoto(user?.userProfilePicture);
        }
    }, [user?.userProfilePicture])


    return (
        <>
            <CustomModal isOpen={isOpen} onClose={() => { closeModal(); }}>
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    {/* Main Card Container - CHANGED: Added overflow-y-auto here so everything scrolls together */}
                    <div
                        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                        style={{
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        {/* 1. Header Section */}
                        <div className="relative h-48 bg-gradient-to-r from-[#005498] to-[#003f73]">
                            {/* <div className="absolute top-6 left-6">
                                <h1 className="text-white/90 text-lg font-medium tracking-wide">Edit Profile</h1>
                            </div> */}
                        </div>

                        {/* 2. Content Section - CHANGED: Removed overflow-y-auto from here */}
                        <div className="px-8 pb-8">

                            {/* Avatar Section */}
                            <div className="relative flex justify-center -mt-24 mb-8">
                                <div className="relative group">

                                    {/* Hidden File Input */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file && file.size > 5 * 1024 * 1024) {
                                                alert("File size must be less than 5MB");
                                                e.target.value = "";
                                            } else {
                                                uploadProfilePicture(file);
                                            }
                                        }}
                                    />

                                    {/* Avatar Image / Placeholder */}
                                    <div className="w-40 h-40 rounded-full border-[6px] border-white shadow-md bg-white flex items-center justify-center overflow-hidden relative z-10">
                                        {profilePhoto ? (
                                            <img
                                                src={typeof profilePhoto === 'string' ? profilePhoto : URL.createObjectURL(profilePhoto)}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <User className="w-16 h-16 text-[#005498]/40" />
                                            </div>
                                        )}

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                            <span className="text-white text-xs font-semibold">Change</span>
                                        </div>
                                    </div>

                                    {/* Camera Icon Badge */}
                                    <div className="absolute bottom-2 right-2 z-20 bg-white p-2 rounded-full shadow-lg border border-gray-100 text-[#005498]">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Form Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={data?.email || ""}
                                            disabled
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed focus:outline-none"
                                        />
                                        <Mail className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Username */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter username"
                                            value={data?.userName || ""}
                                            onChange={(e) =>
                                                setUserData((prev) => ({ ...prev, userName: e.target.value }))
                                            }
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#005498] focus:ring-4 focus:ring-[#005498]/10 transition-all duration-200 outline-none"
                                        />
                                        <User className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Display Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Display Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter display name"
                                            value={data?.displayName || ""}
                                            onChange={(e) =>
                                                setUserData((prev) => ({ ...prev, displayName: e.target.value }))
                                            }
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#005498] focus:ring-4 focus:ring-[#005498]/10 transition-all duration-200 outline-none"
                                        />
                                        <Edit3 className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="0000000000"
                                            value={data?.phoneNo || ""}
                                            onChange={(e) =>
                                                setUserData((prev) => ({ ...prev, phoneNo: e.target.value }))
                                            }
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#005498] focus:ring-4 focus:ring-[#005498]/10 transition-all duration-200 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <Phone className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Bio (Full Width) */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Bio</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Tell us a little about yourself..."
                                        value={data?.bio || ""}
                                        onChange={(e) =>
                                            setUserData((prev) => ({ ...prev, bio: e.target.value }))
                                        }
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#005498] focus:ring-4 focus:ring-[#005498]/10 transition-all duration-200 outline-none resize-none"
                                    ></textarea>
                                </div>

                            </div>

                            {/* 4. Action Buttons */}
                            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => onClose()}
                                    className="px-6 py-2.5 rounded-3xl text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors  cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button className="px-8 py-2.5 rounded-3xl bg-[#005498] text-white font-medium shadow-lg shadow-blue-900/20 hover:bg-[#00447a] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer" onClick={saveProfileData}>
                                    Save Changes
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </CustomModal>
        </>
    )
}

export default Profile
