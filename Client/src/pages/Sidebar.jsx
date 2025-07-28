import MenuIcon from '../BoxIcons/MenuIcon';
import SidebarIcon from '../components/SidebarIcon';
import Chat from '../BoxIcons/ChatIcons';
import Setting from "../BoxIcons/SettingIcon";
import Archive from "../BoxIcons/ArchiveIcon";
import Favorite from "../BoxIcons/FavouriteIcon";
import DonutLargeRoundedIcon from "../BoxIcons/DonutLargeRoundedIcon";
import AccountCircleOutlinedIcon from "../BoxIcons/AccountCircleOutlinedIcon";
import ExitToAppIcon from '../BoxIcons/ExitToApplication';
import { Divider } from '@mui/material';
import { useDispatch } from 'react-redux';
import { toggleMenuState } from '../store/slice/menuDrawerSlice';
import MenuDrawer from '../components/MenuDrawer';
import { logout } from '../store/slice/authSlice';


const Sidebar = () => {
    const dispatch = useDispatch();
    const topGroupIcons = [{
        icon: MenuIcon,
        onClick: () => dispatch(toggleMenuState())
    }];
    const topFunctionalitiesGroupIcon = [
        {
            icon: Chat,
            onClick: () => () => {console.log("clicked chat");}
        },
        {
            icon: DonutLargeRoundedIcon,
            onClick: () => () => {console.log("clicked status");}
        },
    ];
    const bottomChatGroupIcons = [
        {
            icon: Archive,
            onClick: () => () => {console.log("clicked archive chat");}
        },
        {
            icon: Favorite,
            onClick: () => () => {console.log("clicked favorite");}
        }
    ];
    const bottomFunctionGroupIcons = [
        {
            icon: AccountCircleOutlinedIcon,
            onClick: () => () => {console.log("clicked profile");}
        },
        {
            icon: Setting,
            onClick: () => () => {console.log("clicked setting");}
        },
        {
            icon: ExitToAppIcon,
            onClick: () => {dispatch(logout()); console.log("clicked logout");}
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

        </>
    )
}

export default Sidebar



