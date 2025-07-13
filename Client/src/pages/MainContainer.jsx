import ChatContainer from '../components/ChatContainer'
import ChatListContainer from './ChatListContainer'

const MainContainer = () => {
  return (
    <div className='w-full flex flex-row'>
      <div className='w-[400px]'><ChatListContainer/></div>
      <ChatContainer/>
    </div>
  )
}

export default MainContainer
