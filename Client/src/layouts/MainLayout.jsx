import Header from '../pages/Header'
import MainContainer from '../pages/MainContainer'
import Sidebar from '../pages/Sidebar'

const MainLayout = () => {
    return (
        <div className='bg-[#f3f3f3] h-screen w-full flex flex-col overflow-hidden'>
            <Header />
            <div className='flex flex-row flex-1'>
                <Sidebar />
                <MainContainer/>
            </div>
        </div>
    )
}

export default MainLayout
