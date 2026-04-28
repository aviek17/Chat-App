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
import { removeUerInfo } from '../store/slice/selectedUserSlice';
import MenuDrawer from '../components/MenuDrawer';
import { logout } from '../store/slice/authSlice';
import { useState } from 'react';
import { AuthEvents } from '../sockets/events/auth';
import Profile from '../components/Profile';
import { UserRoundPlus } from 'lucide-react';
import { useCallback } from 'react';


const Sidebar = () => {

    const [profileModalOpen, setProfileModalOpen] = useState(false);

    const dispatch = useDispatch();
    const topGroupIcons = [{
        icon: MenuIcon,
        onClick: () => dispatch(toggleMenuState())
    }];

    const triggerNewRequest = useCallback((setter, index) => {
        setter(prev => prev.map((item, i) =>
            i === index ? { ...item, showBadge: true, isNew: true } : item
        ));
    }, []);

    const dismissGlow = useCallback((setter, index) => {
        setter(prev => prev.map((item, i) =>
            i === index ? { ...item, isNew: false } : item
        ));
    }, []);

    const dismissBadge = useCallback((setter, index) => {
        setter(prev => prev.map((item, i) =>
            i === index ? { ...item, showBadge: false, isNew: false } : item
        ));
    }, []);

    const [topFunctionalitiesGroupIcon, setTopFunctionalitiesGroupIcon] = useState([
        {
            icon: Chat,
            onClick: () => { console.log("clicked chat"); },
        },
        {
            icon: UserRoundPlus,
            onClick: () => { console.log("clicked new friends"); },
            showBadge: false,
            isNew: false,
            onGlowDismiss: () => dismissGlow(setTopFunctionalitiesGroupIcon, 1),
        },
        {
            icon: DonutLargeRoundedIcon,
            onClick: () => { console.log("clicked status"); },
            onTriggerNewRequest: () => triggerNewRequest(setTopFunctionalitiesGroupIcon, 1),
        },
    ]);

    const [bottomChatGroupIcons, setBottomChatGroupIcons] = useState([
        {
            icon: Archive,
            onClick: () => { console.log("clicked archive chat"); },
            showBadge: false,
            isNew: false,
            onGlowDismiss: () => dismissGlow(setBottomChatGroupIcons, 0),
            onTriggerNewRequest: () => triggerNewRequest(setBottomChatGroupIcons, 0),
        },
        {
            icon: Favorite,
            onClick: () => { console.log("clicked favorite"); },
            showBadge: false,
            isNew: false,
            onGlowDismiss: () => dismissGlow(setBottomChatGroupIcons, 1),
            onTriggerNewRequest: () => triggerNewRequest(setBottomChatGroupIcons, 1),
        },
    ]);

    const bottomFunctionGroupIcons = [
        {
            icon: AccountCircleOutlinedIcon,
            onClick: () => { setProfileModalOpen(true); }
        },
        {
            icon: Setting,
            onClick: () => { console.log("clicked setting"); }
        },
        {
            icon: ExitToAppIcon,
            onClick: () => {
                AuthEvents.logout();
                dispatch(logout());
                dispatch(removeUerInfo());
                console.log("clicked logout");
            }
        }
    ];



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



