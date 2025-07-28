import { useSelector } from 'react-redux'
import Header from '../pages/Header'
import MainContainer from '../pages/MainContainer'
import Sidebar from '../pages/Sidebar'
import { useEffect } from 'react'
import { useSocket } from '../sockets/hooks/useSocket'
import { AuthEvents } from '../sockets/events/auth'

const MainLayout = () => {
    const { isConnected } = useSocket();
    const userInfo = useSelector(state => state?.user?.userInfo);

    useEffect(() => {

        const handleAuthSuccess = (data) => {
            console.log("Authenticated:", data);
        };
        AuthEvents.onAuthenticationSuccess(handleAuthSuccess);

        if (isConnected) {
            console.log("Socket connected successfully");
            AuthEvents.authenticate({ userId: userInfo?.id });
        }

        return () => {
            AuthEvents.removeAuthListeners();
        };

    }, [isConnected, userInfo?.id])

    return (
        <div className='bg-[#f3f3f3] h-screen w-full flex flex-col overflow-hidden'>
            <Header />
            <div className='flex flex-row flex-1'>
                <Sidebar />
                <MainContainer />
            </div>
        </div>
    )
}

export default MainLayout
