import { useSelector } from 'react-redux'
import Header from '../pages/Header'
import MainContainer from '../pages/MainContainer'
import Sidebar from '../pages/Sidebar'
import { useEffect, useState } from 'react'
import { useSocket } from '../sockets/hooks/useSocket'
import { AuthEvents } from '../sockets/events/auth'

const MainLayout = () => {
    const { isConnected, connectionError, getDebugInfo } = useSocket();
    const userInfo = useSelector(state => state?.user?.userInfo);
    const [authAttempted, setAuthAttempted] = useState(false);

    useEffect(() => {
        if (!isConnected || !userInfo?.id || authAttempted) {
            return;
        }

        setAuthAttempted(true);

        const handleAuthSuccess = (data) => {
            console.log("✅ Authentication successful:", data);
        };

        const handleAuthError = (error) => {
            setAuthAttempted(false); 
        };

        AuthEvents.onAuthenticationSuccess(handleAuthSuccess);
        AuthEvents.onAuthenticationError && AuthEvents.onAuthenticationError(handleAuthError);

        AuthEvents.authenticate({ userId: userInfo.id });

        return () => {
            AuthEvents.removeAuthListeners();
        };

    }, [isConnected, userInfo?.id, authAttempted, connectionError]);

    // Show connection status for debugging
    const debugInfo = getDebugInfo();

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