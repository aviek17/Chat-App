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
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {

        if (!isConnected || !userInfo?.id) {
            setAuthAttempted(false);
            setIsAuthenticated(false);
            AuthEvents.resetAuthStatus();
            return;
        }

        if (authAttempted) {
            return;
        }


        const handleAuthSuccess = (data) => {
            console.log("Authentication successful:", data);
            setIsAuthenticated(true);
            setAuthAttempted(true);
        };

        const handleAuthError = (error) => {
            setAuthAttempted(false);
            setIsAuthenticated(false);
            AuthEvents.resetAuthStatus();
            setTimeout(() => {
                if (isConnected && userInfo?.id) {
                    AuthEvents.authenticate({ userId: userInfo.id });
                }
            }, 3000);
        };

        const handleGeneralError = (error) => {
            if (error.message && error.message.includes('auth')) {
                handleAuthError(error);
            }
        };

        // Set up event listeners FIRST
        AuthEvents.onAuthenticationSuccess(handleAuthSuccess);
        AuthEvents.onAuthenticationError(handleAuthError);
        AuthEvents.onGeneralError(handleGeneralError);

        setTimeout(() => {
            if (isConnected && userInfo?.id && !authAttempted) {
                AuthEvents.authenticate({ userId: userInfo.id });
                setAuthAttempted(true);
            }
        }, 100);

        return () => {
            AuthEvents.removeAuthListeners();
        };

    }, [isConnected, userInfo?.id, connectionError]);

    // Reset auth status when socket disconnects
    useEffect(() => {
        if (!isConnected) {
            AuthEvents.resetAuthStatus();
            setIsAuthenticated(false);
            setAuthAttempted(false);
        }
    }, [isConnected]);

    // Show connection status for debugging
    const debugInfo = getDebugInfo();

    return (
        <div className='bg-[#f3f3f3] h-screen w-full flex flex-col overflow-hidden'>
            {/* Debug info - remove in production */}
            <div style={{
                position: 'fixed',
                top: '50px',
                right: '10px',
                background: 'rgba(0,0,0,0.9)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '11px',
                zIndex: 9999,
                maxWidth: '300px'
            }}>
                <div>🔌 Socket: {isConnected ? '✅' : '❌'}</div>
                <div>🆔 ID: {debugInfo.socketId}</div>
                <div>📡 Connected: {debugInfo.socketConnected ? '✅' : '❌'}</div>
                <div>🔧 Has Socket: {debugInfo.hasSocket ? '✅' : '❌'}</div>
                <div>👤 User: {userInfo?.id || 'none'}</div>
                <div>🔐 Auth Attempted: {authAttempted ? '✅' : '❌'}</div>
                <div>✅ Auth Success: {isAuthenticated ? '✅' : '❌'}</div>
                <div>🏪 Auth Status: {AuthEvents.getAuthStatus() ? '✅' : '❌'}</div>
                {connectionError && <div>❌ Error: {connectionError.message}</div>}
                <div>📋 Events: {debugInfo.registeredEvents.join(', ') || 'none'}</div>
            </div>

            <Header />
            <div className='flex flex-row flex-1'>
                <Sidebar />
                <MainContainer />
            </div>
        </div>
    )
}

export default MainLayout