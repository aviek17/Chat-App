import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLastestMessageForUser, updateUserUnreadMsgCount } from "../../store/slice/allUserMessageSlice";
import { setUserNewMessage } from "../../store/slice/selectedUserSlice";
import { MessageEvents } from '../events/message';

export const useChatSocketEvents = (isAuthenticated) => {
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state?.user?.userInfo);
    const selectedChatUser = useSelector(state => state?.selectedUser?.userInfo);

    const selectedChatUserRef = useRef(selectedChatUser);
    const loggedInUserRef = useRef(loggedInUser);

    useEffect(() => {
        selectedChatUserRef.current = selectedChatUser;
        loggedInUserRef.current = loggedInUser;
    }, [selectedChatUser, loggedInUser]);



    useEffect(() => {

        if (!isAuthenticated) return;

        console.log("Chat Socket Event is up & running!!!");

        // incoming new messages 
        const handleMessageReceived = (data) => {
            const message = data?.message;
            const senderId = data?.senderId;

            const currentSelectedUser = selectedChatUserRef.current;

            dispatch(updateLastestMessageForUser({ userId: senderId, message }));

            if (currentSelectedUser ?.id === senderId) {
                dispatch(setUserNewMessage(message));
            } else {
                dispatch(updateUserUnreadMsgCount({ userId: senderId, count: 1 }));
            }
        };

        MessageEvents.onNewMessage(handleMessageReceived);

        return () => {
            MessageEvents.offNewMessage(handleMessageReceived);
        }

    }, [isAuthenticated])
}