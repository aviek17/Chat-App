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


const Sidebar = () => {

    const topGroupIcons = [MenuIcon];
    const topFunctionalitiesGroupIcon = [Chat, DonutLargeRoundedIcon];
    const bottomChatGroupIcons = [Favorite, Archive];
    const bottomFunctionGroupIcons = [AccountCircleOutlinedIcon, Setting, ExitToAppIcon];

    const dispatch = useDispatch();

    const onMenuClick = () => {
        dispatch(toggleMenuState());
    }


    return (
        <>
            <div style={{ height: `calc(100vh - 50px)` }} className='bg-[#ffffff] w-[50px] flex flex-col justify-between items-center'>
                <div className='mt-[5px] flex flex-col gap-1.5 items-center'>
                    <SidebarIcon iconList={topGroupIcons} onIconClick={onMenuClick} />
                    <SidebarIcon iconList={topFunctionalitiesGroupIcon} />
                </div>
                <div className='mt-[15px] flex flex-col gap-1.5 mb-[15px] items-center'>
                    <SidebarIcon iconList={bottomChatGroupIcons} />
                    <Divider sx={{ borderColor: '#005498', width : "90%" }} />
                    <SidebarIcon iconList={bottomFunctionGroupIcons} />
                </div>
            </div>

            <MenuDrawer />

        </>
    )
}

export default Sidebar



