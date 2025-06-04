import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import boyImage from '../assets/BoyProfilePhoto.jpeg';
import girlImage from '../assets/GirlProfilePhoto.jpeg';
import { useState } from 'react';

const GenderToggleButton = () => {
    const [gender, setGender] = useState("male");

    const handleGender = (event, val) => {
        setGender(val);
    }

    return (
        <>
            <div className="flex justify-center">
                <div className="flex gap-2">
                    <ToggleButtonGroup
                        value={gender}
                        exclusive
                        onChange={handleGender}
                        aria-label="gender"
                        className='gap-3'
                    >
                        <ToggleButton value="male" aria-label="male"
                            sx={{
                                padding: '1px',
                                borderTopRightRadius: '4px !important',
                                borderBottomRightRadius: '4px !important',
                                borderTopLeftRadius: '4px !important',
                                borderBottomLeftRadius: '4px !important',
                                backgroundColor: gender === "male" ? "#005498 !important" : "transparent !important",
                                color: gender === "male" ? "white" : "inherit",
                                '&:hover': {
                                    backgroundColor: gender === "male" ? "#003f7f !important" : undefined,
                                },
                            }}>
                            <img src={boyImage} alt="Boy" className="w-10 h-10" />
                        </ToggleButton>
                        <ToggleButton value="female" aria-label="female"
                            sx={{
                                padding: '1px',
                                borderTopRightRadius: '4px !important',
                                borderBottomRightRadius: '4px !important',
                                borderTopLeftRadius: '4px !important',
                                borderBottomLeftRadius: '4px !important',
                                borderLeft: '1px solid rgba(0, 0, 0, 0.12) !important',
                                backgroundColor: gender === "female" ? "#d81b60 !important" : "transparent !important",
                                color: gender === "female" ? "white" : "inherit",
                                '&:hover': {
                                    backgroundColor: gender === "female" ? "#ad1457 !important" : undefined,
                                },
                            }}>
                            <img src={girlImage} alt="Girl" className="w-10 h-10" />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>

        </>
    )
}

export default GenderToggleButton
