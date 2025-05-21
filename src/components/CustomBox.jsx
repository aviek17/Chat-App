import Box from '@mui/material/Box';

const CustomBox = ({ children, style }) => {
  return (
    <Box sx={{ style }}>
      {children}
    </Box>
  )
}

export default CustomBox;
