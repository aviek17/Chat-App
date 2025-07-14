import React, { useEffect, useRef, useState } from 'react';
import { Search, MoreVertical, MessageCircle, Archive, Settings, User, Phone, Video, Users } from 'lucide-react';
import { colors } from '../styles/theme';
import { useSelector } from 'react-redux';


// Mock data for demonstration
const mockChats = [
  { id: 1, name: 'John Doe', lastMessage: 'Hey, how are you doing?', time: '12:30 PM', unreadCount: 2, avatar: 'JD' },
  { id: 2, name: 'Sarah Wilson', lastMessage: 'See you tomorrow!', time: '11:45 AM', unreadCount: 0, avatar: 'SW' },
  { id: 3, name: 'Team Project', lastMessage: 'Alice: Great work everyone!', time: '10:20 AM', unreadCount: 5, avatar: 'TP' },
  { id: 4, name: 'Mom', lastMessage: 'Don\'t forget to call grandma', time: '9:15 AM', unreadCount: 1, avatar: 'M' },
  { id: 5, name: 'David Chen', lastMessage: 'Thanks for the help!', time: 'Yesterday', unreadCount: 0, avatar: 'DC' },
  { id: 6, name: 'Work Group', lastMessage: 'Meeting at 3 PM', time: 'Yesterday', unreadCount: 0, avatar: 'WG' },
  { id: 7, name: 'Lisa Rodriguez', lastMessage: 'Happy birthday! 🎉', time: 'Monday', unreadCount: 0, avatar: 'LR' },
  { id: 8, name: 'Mike Johnson', lastMessage: 'Let\'s catch up soon', time: 'Sunday', unreadCount: 0, avatar: 'MJ' },
  { id: 9, name: 'David Chen', lastMessage: 'Thanks for the help!', time: 'Yesterday', unreadCount: 0, avatar: 'DC' },
  { id: 10, name: 'Work Group', lastMessage: 'Meeting at 3 PM', time: 'Yesterday', unreadCount: 0, avatar: 'WG' },
  { id: 11, name: 'Lisa Rodriguez', lastMessage: 'Happy birthday! 🎉', time: 'Monday', unreadCount: 0, avatar: 'LR' },
  { id: 12, name: 'Mike Johnson', lastMessage: 'Let\'s catch up soon', time: 'Sunday', unreadCount: 0, avatar: 'MJ' }
];

const ChatListContainer = () => {

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const chatListRef = useRef(null);

  // Handle scroll events
  const handleScroll = () => {
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Hide scrollbar after 1 second of no scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);


  const theme = useSelector((state) => state.theme.themeMode);

  const currentColors = {
    background: colors.background[theme],
    text: colors.text[theme],
    chat: colors.chat[theme]
  };

  const sidebarStyle = {
    backgroundColor: currentColors.background.primary,
    color: currentColors.text.primary,
    borderRight: `1px solid ${theme === 'light' ? '#e0e0e0' : '#383838'}`,
    width: "400px"
  };

  const headerStyle = {
    backgroundColor: currentColors.background.primary
  };

  const searchStyle = {
    backgroundColor: currentColors.background.secondary,
    color: currentColors.text.primary,
    border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#505050'}`
  };

  const chatItemStyle = {
    backgroundColor: 'transparent',
    borderBottom: `1px solid ${theme === 'light' ? '#f0f0f0' : '#2d2d2d'}`
  };

  const chatItemHoverStyle = {
    backgroundColor: currentColors.background.elevated
  };

  return (
    <div className="flex flex-col h-[calc(100vh-50px)] w-80 bg-white" style={sidebarStyle}>
      {/* Header */}
      <div className="flex items-center justify-between p-4" style={headerStyle}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <User size={20} style={{ color: currentColors.text.secondary }} />
          </div>
          <span className="font-medium text-lg">Chats</span>
        </div>
        <div className="flex items-center space-x-2">
          
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreVertical size={20} style={{ color: currentColors.text.secondary }} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: currentColors.text.secondary }} />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={searchStyle}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex px-4 pb-2">
        <button
          className="px-4 py-2 text-sm font-medium rounded-full mr-2 transition-colors"
          style={{
            backgroundColor: colors.primary.main,
            color: colors.primary.contrastText
          }}
        >
          All
        </button>
        <button
          className="px-4 py-2 text-sm font-medium rounded-full mr-2 transition-colors"
          style={{
            backgroundColor: 'transparent',
            color: currentColors.text.secondary
          }}
        >
          Unread
        </button>
        <button
          className="px-4 py-2 text-sm font-medium rounded-full transition-colors"
          style={{
            backgroundColor: 'transparent',
            color: currentColors.text.secondary
          }}
        >
          Groups
        </button>
      </div>



      <div ref={chatListRef}
        className={`flex-1 overflow-y-auto transition-all duration-300 scrollbar-visible}`}>
        {mockChats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center p-4 cursor-pointer transition-colors hover:bg-gray-50"
            style={chatItemStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = chatItemHoverStyle.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-sm font-medium" style={{ color: currentColors.text.primary }}>
                {chat.avatar}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-sm truncate" style={{ color: currentColors.text.primary }}>
                  {chat.name}
                </h3>
                <span className="text-xs ml-2 flex-shrink-0" style={{ color: currentColors.text.secondary }}>
                  {chat.time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm truncate" style={{ color: currentColors.text.secondary }}>
                  {chat.lastMessage}
                </p>
                {chat.unreadCount > 0 && (
                  <div
                    className="ml-2 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 min-w-5 h-5 flex items-center justify-center"
                    style={{
                      backgroundColor: colors.primary.main,
                      color: colors.primary.contrastText
                    }}
                  >
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

        <div className='h-[15px]'></div>

    </div>
  )
}

export default ChatListContainer
