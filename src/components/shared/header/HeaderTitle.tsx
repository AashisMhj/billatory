import { Box, Typography } from '@mui/material';
import { useContext } from 'react';
import { SettingsContext } from '@/context/settings';

const HeaderTitle = () => {
    const {value} = useContext(SettingsContext);
    return (
        <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
            <Typography variant='h4'>
                {value.organization_name}
            </Typography>
        </Box>
    )
}

export default HeaderTitle;