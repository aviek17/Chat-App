import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenuState } from '../redux-store/slice/MenuDrawerSlice';
import { Divider, Drawer } from '@mui/material';
import Logo from "../assets/Logo_Nobg.png"
import Chat from '../BoxIcons/ChatIcons';
import Setting from "../BoxIcons/SettingIcon";
import Archive from "../BoxIcons/ArchiveIcon";
import Favorite from "../BoxIcons/FavouriteIcon";
import DonutLargeRoundedIcon from "../BoxIcons/DonutLargeRoundedIcon";
import MenuIcon from '../BoxIcons/MenuIcon';
import AccountCircleOutlinedIcon from "../BoxIcons/AccountCircleOutlinedIcon";
import ExitToAppIcon from '../BoxIcons/ExitToApplication';

const MenuDrawer = () => {
    const menuState = useSelector(state => state.navigationState?.menuDrawerState);
    const dispatch = useDispatch();


    const onMenuClick = () => {
        dispatch(toggleMenuState());
    }

    return (
        <>
            <Drawer open={menuState} onClose={onMenuClick} className='menu'
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: '#e9f5ff08',
                            backdropFilter: 'blur(10px)',
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
                <div className='w-[220px] h-full p-[5px]'>
                    <div className='relative h-[60px]'><img src={Logo} className="h-[50px] w-[150px] absolute left-[5px] top-[5px]" /></div>
                    <div style={{height : 'calc(100vh - 65px)'}} className='flex flex-col justify-between'>
                        <div className='flex flex-col gap-2.5'>
                            <MenuIconDetails Icon={MenuIcon} />
                            <MenuIconDetails Icon={Chat} label='Chat' statusVal={10} selected />
                            <MenuIconDetails Icon={DonutLargeRoundedIcon} label='Status' hoverReqd statusSymbol />
                        </div>
                        <div className='mt-[15px] flex flex-col gap-1.5 mb-[15px] items-center'>
                            <MenuIconDetails Icon={Favorite} label='Bookmarked Chats' />
                            <MenuIconDetails Icon={Archive} label='Archived Chats' />
                            <Divider sx={{ borderColor: '#005498', width: "90%" }} />
                            <MenuIconDetails Icon={AccountCircleOutlinedIcon} label='Profile' />
                            <MenuIconDetails Icon={Setting} label='Setting' />
                            <MenuIconDetails Icon={ExitToAppIcon} label='Exit App' />
                        </div>
                    </div>
                </div>
            </Drawer >
        </>
    )
}

export default memo(MenuDrawer)



const MenuIconDetails = ({ Icon = Chat, label = "", statusVal = null, selected = false, hoverReqd = true, statusSymbol = false }) => {
    const dispatch = useDispatch();
    const navigate = () => {
        dispatch(toggleMenuState());
    }
    return (
        <>
            <div
                className={`cursor-pointer relative flex flex-row justify-between p-[8px] rounded-[6px]  items-center
                ${selected ? 'bg-[#98b9d31c] shadow-[0.95px_3.95px_6.6px_#00549836]' : ''}                
                ${hoverReqd ? 'hover:bg-[#98b9d31c] hover:shadow-[0.95px_3.95px_6.6px_#00549836]' : ''}
                ${label ? 'w-full' : 'w-fit'}`
                }

                onClick={navigate}
            >
                {
                    selected && <div className='absolute inset-y-0 left-0 w-[3px] bg-[#005498] rounded-tl-[6px] rounded-bl-[6px]'></div>
                }
                <div className='flex gap-[10px] items-center'>
                    <Icon className="w-[20px] text-[#005498]" />
                    {
                        label &&
                        <span className='text-[#005498] text-[13px] font-bold'>{label}</span>
                    }
                </div>
                <div>
                    {
                        statusVal &&
                        <div className='bg-[#005498] text-white rounded-[36%] flex text-[11px] text-center px-[6px] py-[2px]'>{statusVal}</div>
                    }
                    {
                        statusSymbol &&
                        <div className='bg-[#005498] text-white rounded-full flex text-[13px] text-center px-[4px] py-[4px] w-[6px] h-[6px]'></div>
                    }
                </div>
            </div>
        </>
    )
}
