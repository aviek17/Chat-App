import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getContactList, getContactPendingRequests, getUserPendingRequests } from "../services/user.service";
import { setContacts } from "../store/slice/contactSlice";
import { getUserDisplayMessage } from "../services/chat.service";
import { addInitialIncomingrequest, addInitialOutgoingrequest } from "../store/slice/friendSlice";
import { setInitDone } from "../store/slice/appSlice";
import { addAllLastUsersMessages } from "../store/slice/allUserMessageSlice";


export function useAppInit(isAuthenticated) {
    const dispatch = useDispatch();

     const initDone  = useSelector(state => state.app.initDone);

    const [initLoading, setInitLoading] = useState(false);
    const [initProgress, setInitProgress] = useState(0);
    const [initText, setInitText] = useState('');
    // const [initDone, setInitDone] = useState(false);
    const [initError, setInitError] = useState(null);

    const apiSteps = [
        {
            label: "Fetching contacts...",
            fn: async () => {
                const data = await getContactList();
                dispatch(setContacts(data?.contacts));
            },
        },
        {
            label: "Loading user display message...",
            fn: async () => {
                const data = await getUserDisplayMessage();
                dispatch(addAllLastUsersMessages(data?.data ?? {}));
            }
        },

        {
            label: "Loading user pending request...",
            fn: async () => {
                const data = await getUserPendingRequests();
                dispatch(addInitialIncomingrequest(data?.pendingRequests || []));
            }
        },

         {
            label: "Loading contact pending request...",
            fn: async () => {
                const data = await getContactPendingRequests();
                dispatch(addInitialOutgoingrequest(data?.pendingRequests || []));
            }
        },

    ];

    useEffect(() => {

        console.log("App init - isAuthenticated:", isAuthenticated, "initDone:", initDone, "initLoading:", initLoading);
        
        if (!isAuthenticated || initDone || initLoading) return;

        const runInitApis = async () => {
            setInitLoading(true);
            const total = apiSteps.length;

            try {
                for (let i = 0; i < total; i++) {
                    setInitText(apiSteps[i].label);

                    const from = Math.round((i / total) * 100);
                    const to = Math.round(((i + 1) / total) * 100);

                    let current = from;
                    const ticker = setInterval(() => {
                        current += 0.5;
                        if (current >= to - 2) return clearInterval(ticker);
                        setInitProgress(Math.round(current));
                    }, 30);

                    await apiSteps[i].fn();

                    clearInterval(ticker);
                    setInitProgress(to);
                }

                setInitText('Done!');
                dispatch(setInitDone()); 

            } catch (err) {
                console.error('Init API failed:', err);
                setInitError(err);
                setInitText('Failed to load. Please refresh.');
            } finally {
                setInitLoading(false);
            }
        };

        runInitApis();
    }, [isAuthenticated]);

    return { initDone, initProgress, initText, initError };
}