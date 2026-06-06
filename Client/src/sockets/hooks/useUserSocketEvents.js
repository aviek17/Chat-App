import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageEvents } from '../events/message';
import { UserEvents } from "../events/user";
import { addOnlineFriend, removeOnlineFriend, setOnlineFriends } from "../../store/slice/friendSlice";
import { addContact } from "../../store/slice/contactSlice";

export const useUserSocketEvents = (isAuthenticated) => {
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

        console.log("User Socket Event is up & running!!!");

        const handleNewFriendCameOnline = (data) => {
            dispatch(addOnlineFriend(data?.userId));
        }

        const handleCurrentOnlineFriendList = (data) => {
            dispatch(setOnlineFriends(data?.onlineUserIds ?? []));
        }

        const handleOnUserWentOffline = (data) => {
            dispatch(removeOnlineFriend(data?.userId));
        }

        const handleAcceptRequest = async (data) => {
           UserEvents.getFriendList();
           dispatch(addContact(data?.userInfo));
        };

        UserEvents.getFriendList();
        UserEvents.getCurrentActiveFriends(handleCurrentOnlineFriendList);
        UserEvents.onNewUserOnline(handleNewFriendCameOnline);
        UserEvents.onUserOffline(handleOnUserWentOffline);
        UserEvents.onAcceptingRequest(handleAcceptRequest);


        return () => {
            UserEvents.removeCurrentActiveFriends(handleCurrentOnlineFriendList);
            UserEvents.offNewUserOnline(handleNewFriendCameOnline);
            UserEvents.offUserOffline(handleOnUserWentOffline);
            UserEvents.removeAcceptingRequest(handleAcceptRequest);
        }

    }, [isAuthenticated])
}