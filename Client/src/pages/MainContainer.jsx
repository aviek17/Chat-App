import { useDispatch } from 'react-redux';
import ChatContainer from '../components/ChatContainer'
import ChatListContainer from './ChatListContainer'
import { useEffect } from 'react';
import { updateuserStatusInMeesageList } from '../store/slice/allUserMessageSlice';
import { ChatEvents } from '../sockets/events/chat';

const MainContainer = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const handleUserOnline = ({ userId }) => {

      // Update status in allUsersMsgs slice (chat list / background chats)
      dispatch(updateuserStatusInMeesageList({
        userId,
        newStatus: 'delivered'
      }));

    };

    ChatEvents.onNewUserOnline(handleUserOnline);

    return () => {
      ChatEvents.offNewUserOnline(handleUserOnline);
    };
  }, [dispatch]);

  return (
    <div className='w-full flex flex-row border-t border-l border-gray-200 rounded-tl-lg overflow-hidden'>
      <div className='w-[400px]'><ChatListContainer /></div>
      <ChatContainer />
    </div>
  )
}

export default MainContainer
