import { useDispatch, useSelector } from 'react-redux'
import Header from '../pages/Header'
import MainContainer from '../pages/MainContainer'
import Sidebar from '../pages/Sidebar'
import { useEffect, useState } from 'react'
import { useSocket } from '../sockets/hooks/useSocket'
import { AuthEvents } from '../sockets/events/auth'
import { setAllChatList } from '../store/slice/chatListSlice'
import { Outlet } from 'react-router-dom'
import { useAppInit } from '../hooks/useAppInit'
import { UserEvents } from '../sockets/events/user'
import { setContacts } from '../store/slice/contactSlice'
import { getContactList } from '../services/user.service'
import { useCommonApi } from '../hooks/useCommonApi'
import { useChatSocketEvents } from '../sockets/hooks/useChatSocketEvents'

const MainLayout = () => {
    const dispatch = useDispatch();
    const { isConnected, connectionError, getDebugInfo } = useSocket();
    const userInfo = useSelector(state => state?.user?.userInfo);
    const [authAttempted, setAuthAttempted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const { initDone, initProgress, initText, initError } = useAppInit(isAuthenticated);
    useChatSocketEvents(isAuthenticated);

    const { getUpdatedContactData, updatedUserDisplayMessage } = useCommonApi();

    const handleAcceptRequest = async (data) => {
        await getUpdatedContactData();
        await updatedUserDisplayMessage(data);
    };


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
            dispatch(setAllChatList(data.recentChats || []));
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
                //Get updated contact data after accepting or rejecting the request
                UserEvents.onAcceptingRequest(handleAcceptRequest);
            }
        }, 100);

        return () => {
            AuthEvents.removeAuthListeners();
            UserEvents.removeAcceptingRequest(handleAcceptRequest);
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
            {/* <div style={{
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
            </div> */}


            {!initDone && (
                <div className='fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-4'>
                    <p className='text-[16px] text-gray-700'>{initText || 'Connecting...'}</p>
                    <div className='w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden'>
                        <div
                            className='h-full bg-[#005498] rounded-full transition-all duration-300 ease-out'
                            style={{ width: `${initProgress}%` }}
                        />
                    </div>
                    <p className='text-[14px] text-gray-400'>{initProgress}%</p>
                </div>
            )}

            <Header />
            <div className='flex flex-row flex-1'>
                <Sidebar />
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout