import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenuState } from '../redux-store/slice/MenuDrawerSlice';
import { Drawer } from '@mui/material';
import Logo from "../assets/Logo_Nobg.png"
import MenuIcon from '@mui/icons-material/Menu';
import Chat from '../BoxIcons/ChatIcons';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import SidebarIcon from './SidebarIcon';

const MenuDrawer = () => {
    const menuState = useSelector(state => state.navigationState?.menuDrawerState);
    const dispatch = useDispatch();

    const topGroupIcons = [MenuIcon];
    const topFunctionalitiesGroupIcon = [Chat, DonutLargeRoundedIcon];

    const onMenuClick = () => {
        dispatch(toggleMenuState());
    }

    return (
        <>
            <Drawer open={menuState} onClose={onMenuClick} className='menu'
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: '#00549805',
                            backdropFilter: 'blur(20px)',
                            borderTopRightRadius: '10px',
                            borderBottomRightRadius: '10px',
                        },
                    },
                    backdrop: {
                        sx: {
                            backgroundColor: 'transparent',
                        },
                    }
                }}
            >
                <div className='w-[250px] h-full p-[5px]'>
                    <div className='relative h-[60px]'><img src={Logo} className="h-[50px] w-[170px] absolute left-[5px] top-[5px]" /></div>
                    <div className='flex flex-col justify-between'>
                        <div className='flex flex-col gap-1.5'>
                            <SidebarIcon iconList={topGroupIcons} onIconClick={onMenuClick} />
                        </div>
                    </div>
                </div>
            </Drawer >
        </>
    )
}

export default memo(MenuDrawer)
