import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStaticImageUrl } from "../services/common.service";
import {requestApproval } from "../services/user.service";
import { acceptFriendRequest, rejectFriendrequest } from "../store/slice/friendSlice";
import { addContact } from "../store/slice/contactSlice";
import { UserEvents } from "../sockets/events/user";


function UserSVG() {
    return (
        <svg viewBox="0 0 24 24" className="w-10 h-10" style={{ fill: "#005498", opacity: 0.75 }}>
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
    );
}

function MutualIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" style={{ fill: "#005498" }}>
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
    );
}

function Toast({ message, visible }) {
    return (
        <div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium px-5 py-2 rounded-full z-50 pointer-events-none transition-all duration-200"
            style={{
                backgroundColor: "#005498",
                opacity: visible ? 1 : 0,
                transform: `translateX(-50%) translateY(${visible ? "0" : "6px"})`,
            }}
        >
            {message}
        </div>
    );
}

function ContactCard({ contact, requestType = "pending" }) {
    const [removing, setRemoving] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: "" });
    const dispatch = useDispatch();


    const handleAcceptRequest = async () => {
        UserEvents.getFriendList();
    };


    let profilePicture = null;
    if (contact?.avatar?.filename) {
        profilePicture = getStaticImageUrl(contact.avatar.filename);
    }

    const handleConfirmAction = async () => {
        let payload = {
            "contactUserId": contact?.id,
            "action": "accept"
        }

        try {
            const response = await requestApproval(payload);
            if (response.success) {
                showToast("Friend request accepted");
                dispatch(acceptFriendRequest(contact?.id));
                dispatch(addContact(response?.userInfo));
                handleAcceptRequest();
            }
        } catch (err) {
            console.log("Error accepting friend request", err);
        }
    };

    const handleDeleteAction = async () => {
        let payload = {
            "contactUserId": contact?.id,
            "action": "reject"
        }
        try {
            const response = await requestApproval(payload);
            if (response.success) {
                showToast("Friend request rejected");
                dispatch(rejectFriendrequest(contact?.id));
            }
        } catch (err) {
            console.log("Error rejecting friend request", err);
        }
    }

    const showToast = (msg) => {
        setToast({ visible: true, message: msg });
        setTimeout(() => setToast({ visible: false, message: "" }), 2000);
    };

    // const mutualText =
    //     contact.mutual !== null
    //         ? `${contact.mutual} mutual friend${contact.mutual !== 1 ? "s" : ""}`
    //         : contact.followed !== null
    //             ? `Followed by ${contact.followed}`
    //             : null;
    return (
        <>
            <div
                className="flex flex-col overflow-hidden transition-all duration-250"
                style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    border: `0.5px solid ${hovered ? "#005498" : "#e4e6ea"}`,
                    opacity: removing ? 0 : 1,
                    transform: removing ? "scale(0.95)" : "scale(1)",
                    transition: "opacity 0.25s, transform 0.25s, border-color 0.15s",
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Avatar photo area */}
                <div
                    className="flex items-center justify-center"
                    style={{ background: "#e8f1f9", height: "130px" }}
                >
                    <div
                        className="rounded-full flex items-center justify-center"
                        style={{ width: "64px", height: "64px", background: "#b8d4ea" }}
                    >
                        {
                            profilePicture ? (<img src={profilePicture} alt="" className="w-full h-full object-cover rounded-full" />) : <UserSVG />
                        }

                    </div>
                </div>

                {/* Name + mutual */}
                <div className="px-2.5 pt-2.5 pb-1 flex justify-center">
                    <p
                        className="text-sm font-semibold truncate text-center"
                        style={{ color: "#050505", margin: 0 }}
                    >
                        {contact?.displayName ?? contact?.username}
                    </p>
                </div>

                <div className="px-2.5 pb-2.5 pt-2 flex flex-col gap-1.5">
                    {
                        requestType === "pending" && (
                            <>
                                <ConfirmBtn onClick={() => handleConfirmAction()} />
                                <DeleteBtn onClick={() => handleDeleteAction()} />
                            </>
                        )
                    }
                    {
                        requestType === "sent" && (
                            <>
                                <RequestSentDisabled onClick={() => { }} />
                                <CancelBtn onClick={() => { }} />
                            </>
                        )
                    }
                </div>
            </div>
            {
                toast && (
                    <Toast message={toast.message} visible={toast.visible} />
                )
            }
        </>
    );
}

function ConfirmBtn({ onClick }) {
    const [bg, setBg] = useState("#005498");
    return (
        <button
            onClick={onClick}
            className="w-full text-white text-sm font-semibold py-1.5 rounded-lg border-none cursor-pointer"
            style={{ background: bg, transition: "background 0.15s" }}
            onMouseEnter={() => setBg("#004280")}
            onMouseLeave={() => setBg("#005498")}
            onMouseDown={() => setBg("#003366")}
            onMouseUp={() => setBg("#004280")}
        >
            Confirm
        </button>
    );
}

function DeleteBtn({ onClick }) {
    const [bg, setBg] = useState("#f0f2f5");
    return (
        <button
            onClick={onClick}
            className="w-full text-sm font-medium py-1.5 rounded-lg border-none cursor-pointer"
            style={{ background: bg, color: "#050505", transition: "background 0.15s" }}
            onMouseEnter={() => setBg("#e4e6ea")}
            onMouseLeave={() => setBg("#f0f2f5")}
            onMouseDown={() => setBg("#d8dadf")}
            onMouseUp={() => setBg("#e4e6ea")}
        >
            Delete
        </button>
    );
}

function CancelBtn({ onClick }) {
    const [bg, setBg] = useState("#f0f2f5");
    return (
        <button
            onClick={onClick}
            className="w-full text-sm font-medium py-1.5 rounded-lg border-none cursor-pointer"
            style={{ background: bg, color: "#050505", transition: "background 0.15s" }}
            onMouseEnter={() => setBg("#e4e6ea")}
            onMouseLeave={() => setBg("#f0f2f5")}
            onMouseDown={() => setBg("#d8dadf")}
            onMouseUp={() => setBg("#e4e6ea")}
        >
            Cancel
        </button>
    );
}

function RequestSentDisabled({ onClick }) {
    return (
        <button
            disabled
            onClick={onClick}
            className="
                w-full
                text-sm
                font-medium
                py-1.5
                rounded-lg
                border
                border-gray-300
                bg-gray-100
               text-[#005498b1]
                cursor-not-allowed
                opacity-80
            "
        >
            Request Sent
        </button>
    );
}






export const ContactMainContainer = () => {
    const [activeTab, setActiveTab] = useState("pending");

    const state = useSelector((state) => state);
    console.log("friend list from store", state);

    const {
        incomingFriendRequestList = [],
        outgoingFriendRequestList = []
    } = useSelector((state) => state.friendList || {});

    const data =
        activeTab === 'pending'
            ? incomingFriendRequestList
            : outgoingFriendRequestList;


    const onTabChange = (tab) => {
        setActiveTab(tab);
    }

    return <>
        <div className="flex-1 h-full p-[12px]">
            <div className="flex flex-row justify-center items-start gap-[12px] rounded-[8px] p-[12px] w-full">
                <div
                    className={`
            py-[8px]
            px-[12px]
            rounded-2xl
            text-[13px]
            font-bold
            cursor-pointer
            border
            transition-all duration-200
            ${activeTab === 'pending'
                            ? 'bg-[#005498] text-white border-[#005498]'
                            : 'bg-white text-[#005498] border-[#005498]'
                        }
        `}
                    onClick={() => onTabChange('pending')}
                >
                    Pending Request
                </div>

                <div
                    className={`
            py-[8px]
            px-[12px]
            rounded-2xl
            text-[13px]
            font-bold
            cursor-pointer
            border
            transition-all duration-200
            ${activeTab === 'sent'
                            ? 'bg-[#005498] text-white border-[#005498]'
                            : 'bg-white text-[#005498] border-[#005498]'
                        }
        `}
                    onClick={() => onTabChange('sent')}
                >
                    Confirm Request
                </div>
            </div>

            <div className="p-6 pb-10 bg-[#f0f2f5] min-h-screen">

                <div
                    className="
                        bg-white
                        rounded-2xl
                        p-6
                        mx-auto
                        border border-[#e4e6ea]
                        max-h-[750px]
                        overflow-y-auto
                    "
                >

                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-[#050505]">
                            Friend requests
                        </h2>

                        <button
                            className="text-sm font-semibold text-[#005498] cursor-pointer"
                            
                        >
                            See all
                        </button>
                    </div>

                    {data.length > 0 ? (
                        <div className="grid grid-cols-6 gap-4">
                            {data.map((contact) => (
                                <ContactCard
                                    key={contact.id}
                                    contact={contact}
                                    requestType={activeTab}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-[#65676b]">
                            <div
                                className="rounded-full flex items-center justify-center mb-3"
                                style={{
                                    width: 64,
                                    height: 64,
                                    background: "#e8f1f9"
                                }}
                            >
                                <UserSVG />
                            </div>

                            <p className="text-sm font-medium">
                                No pending friend requests
                            </p>
                        </div>
                    )}

                </div>

            </div>


        </div>

    </>
}








