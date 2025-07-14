import ChatContainer from '../components/ChatContainer'
import ChatListContainer from './ChatListContainer'

const MainContainer = () => {
  return (
    <div className='w-full flex flex-row border-t border-l border-gray-200 rounded-tl-lg overflow-hidden'>
      <div className='w-[400px]'><ChatListContainer/></div>
      <ChatContainer/>
    </div>
  )
}

export default MainContainer
