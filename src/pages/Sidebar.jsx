import MenuIcon from '@mui/icons-material/Menu';
import SidebarIcon from '../components/SidebarIcon';
import Chat from '../BoxIcons/ChatIcons';
import Setting from "../BoxIcons/SettingIcon";
import Archive from "../BoxIcons/ArchiveIcon";
import Favorite from "../BoxIcons/FavouriteIcon";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import { Divider, Drawer } from '@mui/material';


const Sidebar = () => {

    const topGroupIcons = [MenuIcon];
    const topFunctionalitiesGroupIcon = [Chat, DonutLargeRoundedIcon];
    const bottomChatGroupIcons = [Favorite, Archive];
    const bottomFunctionGroupIcons = [AccountCircleOutlinedIcon, Setting];



    const onMenuClick = () => {
        
    }


    return (
        <>
            <div style={{ height: `calc(100vh - 50px)` }} className='bg-[#ffffff] w-[50px] flex flex-col justify-between items-center'>
                <div className='mt-[15px] flex flex-col gap-1.5'>
                    <SidebarIcon iconList={topGroupIcons} onIconClick={onMenuClick} />
                    <SidebarIcon iconList={topFunctionalitiesGroupIcon} />
                </div>
                <div className='mt-[15px] flex flex-col gap-1.5 mb-[15px]'>
                    <SidebarIcon iconList={bottomChatGroupIcons} />
                    <Divider sx={{ borderColor: '#005498' }} />
                    <SidebarIcon iconList={bottomFunctionGroupIcons} />
                </div>
            </div>

            <Drawer open={false} onClose={onMenuClick}>
                Drawer is opened
            </Drawer>
        </>
    )
}

export default Sidebar


