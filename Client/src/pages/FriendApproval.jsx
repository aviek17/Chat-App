import React from 'react'
import { ContactMainContainer } from '../components/ContactRequest';

const FriendApprovalContainer = () => {
    return (
        <div className='w-full flex flex-row border-t border-l border-gray-200 rounded-tl-lg overflow-hidden'>
            <div className='w-[400px]'>
                <ContactList />
            </div>
            <ContactMainContainer />
        </div>
    )
}

export default FriendApprovalContainer;


const avatarThemes = [
    { bg: "#d8e8f6", icon: "#005498" },
    { bg: "#fde8e8", icon: "#c62828" },
    { bg: "#e8f5e9", icon: "#2e7d32" },
    { bg: "#fff3e0", icon: "#ef6c00" },
    { bg: "#ede7f6", icon: "#5e35b1" },
    { bg: "#f3e5f5", icon: "#8e24aa" },
    { bg: "#e0f7fa", icon: "#00838f" },
    { bg: "#fbe9e7", icon: "#d84315" },
    { bg: "#f1f8e9", icon: "#558b2f" },
    { bg: "#eceff1", icon: "#546e7a" },
];


function UserSVG({ className = "", fill = "#005498", opacity = 0.75 }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            style={{ fill, opacity }}
        >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
    );
}


const ContactList = () => {
    return (
        <div className="w-[380px] bg-white border-r border-gray-200 flex flex-col h-full">

            <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-[18px] font-bold text-[#005498]">
                    Contacts
                </h2>
            </div>

            <div className="p-3 border-b border-gray-100">
                <input
                    type="text"
                    placeholder="Search contacts..."
                    className="
                        w-full
                        px-4
                        py-2
                        rounded-xl
                        bg-[#f0f2f5]
                        outline-none
                        text-sm
                        focus:ring-2
                        focus:ring-[#005498]/20
                    "
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 px-3 py-2 border-b border-gray-100">

                <button className="
                    px-3 py-1.5
                    rounded-xl
                    text-sm
                    font-semibold
                    bg-[#005498]
                    text-white
                ">
                    All
                </button>

                <button className="
                    px-3 py-1.5
                    rounded-xl
                    text-sm
                    font-semibold
                    bg-white
                    border
                    border-[#005498]
                    text-[#005498]
                ">
                    Unread
                </button>

                <button className="
                    px-3 py-1.5
                    rounded-xl
                    text-sm
                    font-semibold
                    bg-white
                    border
                    border-[#005498]
                    text-[#005498]
                ">
                    Favorites
                </button>
                 <button className="
                    px-3 py-1.5
                    rounded-xl
                    text-sm
                    font-semibold
                    bg-white
                    border
                    border-[#005498]
                    text-[#005498]
                ">
                    Archived
                </button>
            </div>

            <div className="h-[calc(100vh-215px)] overflow-y-scroll">

                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, 3, 4, 5].map((item, index) => {

                    const theme = avatarThemes[index % avatarThemes.length];

                    return (
                        <UserwithMessage key={item} />
                    );
                })}

            </div>

        </div>
    )
}


const UserwithMessage = () => {
    return (
        <>
            <div
                className="
                    group
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3
                    cursor-pointer
                    hover:bg-[#f5f9fc]
                    transition-all
                    duration-200
                    border-b
                    border-gray-100
                "
            >

                {/* Left Section */}
                <div className="flex items-center gap-3 min-w-0">

                    {/* Profile Image */}
                    <div className="relative flex-shrink-0">

                        <img
                            src="https://i.pravatar.cc/150?img=12"
                            alt="profile"
                            className="
                                w-[52px]
                                h-[52px]
                                rounded-full
                                object-cover
                                border
                                border-gray-200
                            "
                        />

                        {/* Online Dot */}
                        <div className="
                            absolute
                            bottom-0
                            right-0
                            w-[12px]
                            h-[12px]
                            rounded-full
                            bg-green-500
                            border-2
                            border-white
                        " />

                    </div>

                    {/* User Info */}
                    <div className="min-w-0">

                        {/* Name */}
                        <h3 className="
                            text-[15px]
                            font-semibold
                            text-[#1c1e21]
                            truncate
                        ">
                            Abhik Bubu
                        </h3>

                        {/* Last Message */}
                        <p className="
                            text-[13px]
                            text-[#65676b]
                            truncate
                            mt-[2px]
                        ">
                            Joldi aye
                        </p>

                    </div>

                </div>

                {/* Right Section */}
                <div
                    className="
                        flex
                        flex-col
                        items-end
                        justify-center
                        gap-2
                        ml-3
                    "
                >

                    {/* Time */}
                    <span
                        className="
                        text-[12px]
                        text-[#65676b]
                        font-medium
                    "
                    >
                        3/5/2026
                    </span>

                    {/* Bottom Actions */}
                    <div className="flex items-center">

                        {/* Action Content */}
                        <div
                            className="
                            flex
                            items-center
                            gap-2
                            transition-all
                            duration-200
                            group-hover:translate-x-[-6px]
                        "
                        >

                            {/* Mute Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-[15px] h-[15px] text-[#65676b]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11 5L6 9H3v6h3l5 4V5zm6 4l4 4m0-4l-4 4"
                                />
                            </svg>

                            {/* Archive Badge */}
                            <div
                                className="
                                px-2
                                py-[2px]
                                rounded-full
                                bg-[#65676b]
                                text-white
                                text-[11px]
                                font-semibold
                            "
                            >
                                Archived
                            </div>

                        </div>

                        {/* Dropdown Button */}
                        <button
                            className="
                                w-0
                                opacity-0
                                overflow-hidden
                                group-hover:w-[24px]
                                group-hover:opacity-100
                                transition-all
                                duration-200
                                flex
                                items-center
                                justify-center
                                rounded-full
                                hover:bg-[#e4e6ea]
                                ml-1
                            "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-[16px] h-[16px] text-[#65676b]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                    </div>

                </div>

            </div>
        </>
    )
}




