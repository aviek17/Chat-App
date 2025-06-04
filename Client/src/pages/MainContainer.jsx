import React from 'react'
import ChatScreenContainer from './ChatScreenContainer'
import ChatListContainer from './ChatListContainer'

const MainContainer = () => {
  return (
    <div className='bg-[#0054981c] w-full rounded-tl-[12px]'>
      <div className='w-full h-full grid grid-cols-8 '>
        <div class="col-span-2 border-2 border-r-amber-200">
          <ChatListContainer />
        </div>
        <div class="col-span-6 border-1 border-amber-800">
          <ChatScreenContainer />
        </div>
      </div>
    </div>
  )
}

export default MainContainer
