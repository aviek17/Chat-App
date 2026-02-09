import React, { memo, useState } from 'react';
import { Search, User, Users, UserPlus, ListFilter, MessageCircleMore, Star, Archive, } from 'lucide-react';
import { colors } from '../styles/theme';
import { useDispatch, useSelector } from 'react-redux';
import NewContactContainer from '../components/NewContact';
import { ChatEvents } from '../sockets/events/chat';
import { setSelectedUserInfo } from '../store/slice/selectedUserSlice';
import { getBase64FromFile, getStaticImageUrl } from '../services/common.service';


const formatDateTime = (datetimeStr) => {
  const date = new Date(datetimeStr);
  const now = new Date();

  const stripTime = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const today = stripTime(now);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const givenDate = stripTime(date);
  if (givenDate.getTime() === today.getTime()) {
    return "Today";
  } else if (givenDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);

  return `${day}-${month}-${year}`;
}


const ChatListContainer = () => {
  const theme = useSelector((state) => state.theme.themeMode);
  const messageList = useSelector((state) => state.messageList.allChatList);
  console.log(messageList)
  const [moreOtionsOpen, setMoreOptionsOpen] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newContactOpen, setNewContactOpen] = useState(false);
  const dispatch = useDispatch();

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

  const onReceivingUserStatus = (data) => {
    console.log("UserOnline Status Data:", data);
    let userOnlineStatus = {
      isOnline: data.isOnline
    }
    dispatch(setSelectedUserInfo(userOnlineStatus));
  }

  const openChatContainer = (chatPartner) => {
    let userInfo = {
      id: chatPartner._id,
      displayName: chatPartner.name,
      bio: chatPartner.bio,
      phoneNo: chatPartner.phoneNo,
      email: chatPartner.email,
      username: chatPartner.userName,
      //nickname will be set afterwards
      nickName: {
        firstName: "",
        lastName: ""
      }
    };

    dispatch(setSelectedUserInfo(userInfo));


    ChatEvents.onReceivingUserStatus(onReceivingUserStatus);

    ChatEvents.getUserOnlineStatus({ userId: chatPartner._id });


  }

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
        {messageList.map((chat) => (
          <div
            key={chat.chatPartnerId}
            className="flex items-center p-4 cursor-pointer transition-colors hover:bg-gray-50"
            style={chatItemStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = chatItemHoverStyle.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onClick={() => { openChatContainer(chat.chatPartner) }}
          >
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-3 flex-shrink-0 overflow-hidden">
              {chat.chatPartner?.profilePicture && (
                <img
                  src={getStaticImageUrl(chat.chatPartner.profilePicture)}
                  alt="Profile Pic"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-sm truncate" style={{ color: currentColors.text.primary }}>
                  {chat.chatPartner.displayName || chat.chatPartner.userName}
                </h3>
                <span className="text-xs ml-2 flex-shrink-0" style={{ color: currentColors.text.secondary }}>
                  {formatDateTime(chat.lastMessage.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm truncate" style={{ color: currentColors.text.secondary }}>
                  {chat.lastMessage.content}
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

export default memo(ChatListContainer)



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

