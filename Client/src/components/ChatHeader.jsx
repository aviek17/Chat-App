
import React, { memo } from 'react';
import { Phone, Video, MoreVertical, Search } from 'lucide-react';

const ChatHeader = ({ contact, theme, colors }) => {
    const currentColors = {
        background: colors.background[theme],
        text: colors.text[theme],
        chat: colors.chat[theme]
    };

    const headerStyle = {
        backgroundColor: theme === 'light' ? '#4391d11f' : '#2c2c2c',
        color: currentColors.text.primary
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'online':
                return '#4CAF50';
            case 'away':
                return '#FF9800';
            default:
                return currentColors.text.secondary;
        }
    };
    return (
        <div className="flex items-center justify-between p-4 h-16" style={headerStyle}>
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 border-[2px] border-[#4CAF50] relative">
                    <div
                        className="w-3 h-3 rounded-full absolute bottom-[-3px] right-[-3px] border-2 border-white"
                        style={{ backgroundColor: getStatusColor(contact.status) }}
                    />
                    <span className="text-sm font-medium" style={{ color: currentColors.text.primary }}>
                        {contact.avatar}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="font-medium text-base truncate cursor-pointer" style={{ color: currentColors.text.primary }}>
                        {contact.name}
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
    )
}

export default memo(ChatHeader)
