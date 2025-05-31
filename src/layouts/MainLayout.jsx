import Header from '../pages/Header'
import MainContainer from '../pages/MainContainer';
import Sidebar from '../pages/Sidebar'

const MainLayout = () => {
    return (
        <div className='bg-[#ffffff] h-screen w-full flex flex-col'>
            <Header />
            <div className='flex flex-row'>
                <Sidebar />
                <MainContainer />
            </div>
        </div>
    )
}

export default MainLayout
