// material-ui
import { Box } from '@mui/material';

// project import
import MainCard from '@/components/layouts/MainCard';
import { ReactNode } from 'react';

interface Props{
    children: ReactNode
}

const SetUPCard = ({ children, ...other }:Props) => (
  <MainCard
    sx={{
      maxWidth: { xs: 400, lg: 475 },
      margin: { xs: 2.5, md: 3 },
      '& > *': {
        flexGrow: 1,
        flexBasis: '50%'
      }
    }}
    cardContent={false}
    {...other}
    border={false}
    boxShadow
  >
    <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>{children}</Box>
  </MainCard>
);

export default SetUPCard;
