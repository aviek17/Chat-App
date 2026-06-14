
import React, { memo, useMemo, useState } from 'react';
import { Phone, Video, MoreVertical, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import ContactProfileModal from './UserProfileModal';

const ChatHeader = ({ contact, profilePic, theme, colors }) => {
    const onlineFriendList = useSelector(
        ({ friendList }) => friendList?.onlineFriendList || []
    );

    const [profileOpen, setProfileOpen] = useState(false);


    const onlineFriendSet = useMemo(
        () => new Set(onlineFriendList),
        [onlineFriendList]
    );

    const isFriendOnline = onlineFriendSet.has(contact.id);

    const currentColors = {
        background: colors.background[theme],
        text: colors.text[theme],
        chat: colors.chat[theme]
    };

    const headerStyle = {
        backgroundColor: theme === 'light' ? '#4391d11f' : '#2c2c2c',
        color: currentColors.text.primary
    };

    const getStatusColor = (isOnline) => {
        if (isOnline) {
            return '#4CAF50';
        } else {
            return currentColors.text.secondary;
        }
    };

    const openContactProfile = () => {
        setProfileOpen(true);
    }


    return (
        <>
            <div className="flex items-center justify-between p-4 h-16" style={headerStyle}>
                <div className="flex items-center space-x-3" onClick={openContactProfile}>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 border-2 relative"
                        style={{
                            borderColor: getStatusColor(isFriendOnline)
                        }}>
                        <div
                            className="w-3 h-3 rounded-full absolute bottom-[-3px] right-[-3px] border-2 border-white"
                            style={{ backgroundColor: getStatusColor(isFriendOnline) }}
                        />
                        <div className="w-8 h-8 rounded-full bg-[#005498] flex items-center justify-center overflow-hidden">
                            {profilePic ? (
                                <img
                                    src={profilePic}
                                    alt={contact?.displayName || "User"}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <span
                                    className="text-sm font-medium text-white"
                                    style={{ color: currentColors.text.primary }}
                                >
                                    {(contact?.displayName || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="font-medium text-base truncate cursor-pointer" style={{ color: currentColors.text.primary }}>
                            {contact.displayName}
                        </h2>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {/* <button
                    className="p-2 rounded-full transition-colors"
                    style={{
                        backgroundColor: 'transparent',
                        ':hover': { backgroundColor: currentColors.background.elevated }
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = currentColors.background.elevated;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    <Search size={20} style={{ color: currentColors.text.secondary }} />
                </button> */}

                    <button
                        className="p-2 rounded-full transition-colors"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = currentColors.background.elevated;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <MoreVertical size={20} style={{ color: currentColors.text.secondary }} />
                    </button>
                </div>
            </div>
            <ContactProfileModal
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
                onMessage={() => { setProfileOpen(false); }}
                contact={contact}
                profilePic={profilePic}
                isOnline={isFriendOnline}
            />
        </>
    )
}

export default memo(ChatHeader)
