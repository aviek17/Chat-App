import MenuIcon from '../BoxIcons/MenuIcon';
import SidebarIcon from '../components/SidebarIcon';
import Chat from '../BoxIcons/ChatIcons';
import Setting from "../BoxIcons/SettingIcon";
import Archive from "../BoxIcons/ArchiveIcon";
import Favorite from "../BoxIcons/FavouriteIcon";
import DonutLargeRoundedIcon from "../BoxIcons/DonutLargeRoundedIcon";
import AccountCircleOutlinedIcon from "../BoxIcons/AccountCircleOutlinedIcon";
import ExitToAppIcon from '../BoxIcons/ExitToApplication';
import { Divider, Modal } from '@mui/material';
import { useDispatch } from 'react-redux';
import { toggleMenuState } from '../store/slice/menuDrawerSlice';
import { removeUserInfo } from '../store/slice/selectedUserSlice';
import MenuDrawer from '../components/MenuDrawer';
import { logout } from '../store/slice/authSlice';
import { useState } from 'react';
import { AuthEvents } from '../sockets/events/auth';
import Profile from '../components/Profile';
import { UserRoundPlus } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { persistor } from '../store';
import { useEffect } from 'react';
import { UserEvents } from '../sockets/events/user';
import { addIncomingFriendRequest } from '../store/slice/friendSlice';


const Sidebar = () => {
    const navigate = useNavigate();
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    const openPageHandler = (pageRoute) => {
        navigate(pageRoute);
    }

    const dispatch = useDispatch();
    const topGroupIcons = [{
        icon: MenuIcon,
        onClick: () => dispatch(toggleMenuState())
    }];

    const handleContactClick = () => {
        setTopFunctionalitiesGroupIcon(prev =>
            prev.map(item => {
                if (
                    item.id === "contact" &&
                    item.active === true
                ) {
                    return {
                        ...item,
                        active: false
                    };
                }
                return item;
            })
        );
        openPageHandler("/contact");
    };

    const [topFunctionalitiesGroupIcon, setTopFunctionalitiesGroupIcon] = useState([
        {
            id: "chat",
            icon: Chat,
            active: true,
            onClick: () => {
                openPageHandler("/");
            },
        },
        {
            id: "contact",
            icon: UserRoundPlus,
            onClick: handleContactClick,
            active: false,
        },
        {
            id: "status",
            icon: DonutLargeRoundedIcon,
            onClick: () => { console.log("clicked status"); },
            active: false,
        },
    ]);

    const [bottomChatGroupIcons, setBottomChatGroupIcons] = useState([
        {
            icon: Archive,
            onClick: () => { console.log("clicked archive chat"); },
            active: false,
        },
        {
            icon: Favorite,
            onClick: () => { console.log("clicked favorite"); },
            active: false,
        },
    ]);

    const bottomFunctionGroupIcons = [
        {
            icon: AccountCircleOutlinedIcon,
            onClick: () => { setProfileModalOpen(true); },
            active: false,

        },
        {
            icon: Setting,
            onClick: () => { console.log("clicked setting"); },
            active: false,
        },
        {
            icon: ExitToAppIcon,
            onClick: async () => {
                AuthEvents.logout();
                dispatch(logout());
                await persistor.purge()
                dispatch(removeUserInfo());
                localStorage.clear();
                navigate("/login");
                console.log("clicked logout");
            }
        }
    ];


    useEffect(() => {
        const handleNewContactRequest = (data) => {
            console.log(
                "Received new contact request:",
                data
            );
            if (data?.contactInfo) {
                const contact =
                    Object.values(data.contactInfo)[0];
                dispatch(
                    addIncomingFriendRequest(contact)
                );
            }

            const topGroupIcons = topFunctionalitiesGroupIcon?.map(item => {
                if (item.id === "contact") {
                    return {
                        ...item,
                        active: true
                    }
                }

                return item;
            })

            setTopFunctionalitiesGroupIcon(topGroupIcons);

        }

        UserEvents.onReceivingNewContact(handleNewContactRequest);

        return () => {
            UserEvents.removeReceivingNewContact(handleNewContactRequest);
        }
    }, [dispatch, topFunctionalitiesGroupIcon])



    return (
        <>
            <div style={{ height: `calc(100vh - 50px)` }} className='bg-[#f3f3f3] w-[50px] flex flex-col justify-between items-center'>
                <div className='mt-[5px] flex flex-col gap-1.5 items-center'>
                    <SidebarIcon iconList={topGroupIcons} />
                    <SidebarIcon iconList={topFunctionalitiesGroupIcon} />
                </div>
                <div className='mt-[15px] flex flex-col gap-1.5 mb-[15px] items-center'>
                    <SidebarIcon iconList={bottomChatGroupIcons} />
                    <Divider sx={{ borderColor: '#005498', width: "90%" }} />
                    <SidebarIcon iconList={bottomFunctionGroupIcons} />
                </div>
            </div>

            <MenuDrawer />


            {
                profileModalOpen && <>
                    <Profile isOpen={profileModalOpen} onClose={() => { setProfileModalOpen(false); }} />
                </>
            }

        </>
    )
}

export default Sidebar



