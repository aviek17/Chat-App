import React, { useState } from 'react';
import { Search, User, Users, UserPlus, ListFilter, MessageCircleMore, Star, Archive, UserRound } from 'lucide-react';
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
  const theme = useSelector((state) => state.theme.themeMode);

  const [moreOtionsOpen, setMoreOptionsOpen] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newContactOpen, setNewContactOpen] = useState(false);

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
    <div className="flex flex-col h-[calc(100vh-50px)] w-80 bg-white relative" style={sidebarStyle}>
      {/* Header */}
      <div className="flex items-center justify-between p-4" style={headerStyle}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <User size={20} style={{ color: currentColors.text.secondary }} />
          </div>
          <span className="font-medium text-lg">Chats</span>
        </div>
        <div className="flex items-center space-x-2">

          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setNewChatOpen(!newChatOpen)} >
            <UserPlus size={20} style={{ color: currentColors.text.secondary }} />
          </button>

          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setMoreOptionsOpen(!moreOtionsOpen)}>
            <ListFilter size={20} style={{ color: currentColors.text.secondary }} />
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


      <div
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

      <NewChatContainer isOpen={newChatOpen} onClose={() => { setNewChatOpen(false) }} onOpenNewChat={() => { setNewContactOpen(true) }} />

      <MoreOptionContainer isOpen={moreOtionsOpen} onClose={() => { setMoreOptionsOpen(false) }} />

      <NewContactContainer isOpen={newContactOpen} onClose={() => { setNewContactOpen(false) }} />

    </div>
  )
}

export default ChatListContainer



const NewChatContainer = ({ isOpen, onClose, onOpenNewChat }) => {
  const theme = useSelector((state) => state.theme.themeMode);

  const currentColors = {
    background: colors.background[theme],
    text: colors.text[theme],
    chat: colors.chat[theme]
  };

  const closeContactList = () => {
    console.log("New Contact Clicked");
    onClose();
    onOpenNewChat();
  }

  if (!isOpen) return null;

  return (
    <>

      <div className='absolute top-0 left-0 h-screen w-screen bg-transparent z-10' onClick={() => { onClose() }}></div>

      <div className="absolute top-12 rounded-lg z-50  right-[-250px] w-[350px] h-[600px] bg-[#f1f1f1] p-[26px]" style={{ boxShadow: "#00549857 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }}>
        <div className='text-xl font-semibold text-[#000]'>New Chat</div>
        <div>
          <input type="text" placeholder='Search or start new chat' className='w-full px-3 mt-[16px] bg-gray-100 text-gray-800 h-[30px] text-[12px] rounded border-b border-[#e0e0e0] focus:outline-none focus:ring-0 focus:border-b-2 focus:border-[#005498]' />
        </div>
        <div className='relative overflow-y-scroll h-[480px] w-[calc(100%+22px)] mt-[16px]'>

          <div className="flex items-center space-x-3 mb-[16px]">
            <div className="w-8 h-8 rounded-full bg-[#fff] border border-[#797979] flex items-center justify-center">
              <User size={15} style={{ color: currentColors.text.secondary }} />
            </div>
            <span className="font-medium text-sm cursor-pointer" onClick={closeContactList}>New Contact</span>
          </div>

          {/* <div className="flex items-center space-x-3 mb-[16px]">
          <div className="w-8 h-8 rounded-full bg-[#fff] border border-[#797979] flex items-center justify-center">
            <Users size={15} style={{ color: currentColors.text.secondary }} />
          </div>
          <span className="font-medium text-sm">New Group</span>
        </div> */}

          <div className='sticky top-0 bg-[#f1f1f1] py-2 z-10 text-[12px] text-[#7c7c7c] font-medium'>
            My Contacts
          </div>

          <div className="pb-4">

            {Array.from({ length: 80 }, (_, i) => (
              <div key={i} className="flex items-center space-x-3 py-2 hover:bg-gray-200 rounded cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#005498] flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {String.fromCharCode(65 + (i % 26))}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-sm">Contact {i + 1}</div>
                  <div className="text-xs text-gray-500">Last seen recently</div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </>
  )
}


const MoreOptionContainer = ({ isOpen, onClose }) => {
  const theme = useSelector((state) => state.theme.themeMode);

  const currentColors = {
    background: colors.background[theme],
    text: colors.text[theme],
    chat: colors.chat[theme]
  };

  if (!isOpen) return null;

  return (<>
    <div className='absolute top-0 left-0 h-screen w-screen bg-transparent z-10' onClick={() => { onClose() }}></div>

    <div className="absolute top-12 rounded-lg z-50  right-[-150px] w-[200px] h-[260px] bg-[#f1f1f1] p-[12px]" style={{ boxShadow: "#00549857 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }}>

      <div className='mb-[12px] text-[#c1c1c1] font-[400] text-[14px]'>Filter chats by</div>

      <div className="flex items-center space-x-3 mb-[2px] h-[40px] cursor-pointer pl-1.5 hover:bg-[#e0e0e0] hover:rounded-sm">
        <MessageCircleMore size={18} style={{ color: currentColors.text.secondary }} />
        <span className="font-medium text-[14px] text-[#646464]">Unread</span>
      </div>

      <div className="flex items-center space-x-3 mb-[2px] h-[40px] cursor-pointer pl-1.5 hover:bg-[#e0e0e0] hover:rounded-sm">
        <Star size={18} style={{ color: currentColors.text.secondary }} />
        <span className="font-medium text-[14px] text-[#646464]">Favorites</span>
      </div>

      <div className="flex items-center space-x-3 mb-[2px] h-[40px] cursor-pointer pl-1.5 hover:bg-[#e0e0e0] hover:rounded-sm">
        <User size={18} style={{ color: currentColors.text.secondary }} />
        <span className="font-medium text-[14px] text-[#646464]">Contacts</span>
      </div>


      <div className="flex items-center space-x-3 mb-[2px] h-[40px] cursor-pointer pl-1.5 hover:bg-[#e0e0e0] hover:rounded-sm">
        <Users size={18} style={{ color: currentColors.text.secondary }} />
        <span className="font-medium text-[14px] text-[#646464]">Groups</span>
      </div>

      <div className="flex items-center space-x-3 mb-[2px] h-[40px] cursor-pointer pl-1.5 hover:bg-[#e0e0e0] hover:rounded-sm">
        <Archive size={18} style={{ color: currentColors.text.secondary }} />
        <span className="font-medium text-[14px] text-[#646464]">Archive</span>
      </div>


    </div>
  </>)
}



const NewContactContainer = ({ isOpen, onClose }) => {
  const theme = useSelector((state) => state.theme.themeMode);

  const currentColors = {
    background: colors.background[theme],
    text: colors.text[theme],
    chat: colors.chat[theme]
  };
  if (!isOpen) return null;
  return (<>
    <div className='absolute top-0 left-0 h-screen w-screen bg-black/5 backdrop-blur-xs z-10' onClick={() => { onClose() }}></div>
    <div className="fixed inset-0 z-10">
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[500px] w-[400px] rounded-lg bg-[#ffffff] p-[20px] flex flex-col gap-[16px]' style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px" }}>
        <div className='text-[20px] text-[#000] font-normal'>New Contact</div>
        {/* <div className='text-[14px] text-[#000] font-normal'>Add a new contact to your chat list</div> */}
        <div className="flex items-center justify-center border border-[#b1b0b0] bg-[#b1b0b0] rounded-full w-16 h-16 mx-auto">
          <UserRound size={30} style={{ color: "#fff" }} />
        </div>
        <div className='mt-1'>
          <label className='text-[14px] font-[400] text-[#919191]'>First Name</label>
          <input type='text' className='px-3 mt-[5px] bg-gray-100 text-gray-800 h-[30px] text-[12px] rounded border-b border-[#e0e0e0] focus:outline-none focus:ring-0 focus:border-b-2 focus:border-[#005498] w-full'/>
        </div>
         <div className='mt-1'>
            <label className='text-[14px] font-[400] text-[#919191]'>Last Name</label>
          <input type='text' className='px-3 mt-[5px] bg-gray-100 text-gray-800 h-[30px] text-[12px] rounded border-b border-[#e0e0e0] focus:outline-none focus:ring-0 focus:border-b-2 focus:border-[#005498] w-full'/>
        </div>
      </div>
    </div>

  </>)
}
