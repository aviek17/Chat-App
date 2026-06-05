import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageEvents } from '../events/message';
import { UserEvents } from "../events/user";
import { addOnlineFriend, removeOnlineFriend, setOnlineFriends } from "../../store/slice/friendSlice";

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

        UserEvents.getFriendList();
        UserEvents.getCurrentActiveFriends(handleCurrentOnlineFriendList);
        UserEvents.onNewUserOnline(handleNewFriendCameOnline);
        UserEvents.onUserOffline(handleOnUserWentOffline);


        return () => {
            UserEvents.removeCurrentActiveFriends(handleCurrentOnlineFriendList);
            UserEvents.offNewUserOnline(handleNewFriendCameOnline);
            UserEvents.offUserOffline(handleOnUserWentOffline);
        }

    }, [isAuthenticated])
}