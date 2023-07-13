import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack, Chip } from '@mui/material';
// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from '@/components/Logo';
import { drawerWidth } from '@/config';

// ==============================|| DRAWER HEADER ||============================== //
interface Props{
    open: boolean
}
const DrawerHeader = ({ open }:Props) => {
  const theme = useTheme();

  return (
    <DrawerHeaderStyled theme={theme} open={open} width={drawerWidth}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Logo to='/dashboard' />
        <Chip
          label="1.0.0"
          size="small"
          sx={{ height: 16, '& .MuiChip-label': { fontSize: '0.625rem', py: 0.25 } }}
          component="a"
          href="#"
        />
      </Stack>
    </DrawerHeaderStyled>
  );
};



export default DrawerHeader;
