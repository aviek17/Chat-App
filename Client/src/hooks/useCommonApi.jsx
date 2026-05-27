import { useDispatch } from "react-redux";
import { setContacts } from "../store/slice/contactSlice";
import { getContactList } from "../services/user.service";
import { getUserDisplayMessage } from "../services/chat.service";

export const useCommonApi = () => {

    const dispatch = useDispatch();

    const getUpdatedContactData = async () => {
        try {
            console.log(
                "Fetching updated contact list..."
            );
            const data =
                await getContactList();
            dispatch(
                setContacts(data?.contacts)
            );
        } catch (error) {
            console.error(error);
        }
    };

    const updatedUserDisplayMessage = async () => {
        const data = await getUserDisplayMessage();
    }



    return {
        getUpdatedContactData,
        updatedUserDisplayMessage
    };
};