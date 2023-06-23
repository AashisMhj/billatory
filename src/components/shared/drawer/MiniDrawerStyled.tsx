// material-ui
import { styled } from '@mui/material/styles';
import Drawer, {DrawerClasses} from '@mui/material/Drawer';
import { Theme } from '@mui/material/styles';

// project import
import { drawerWidth } from '@/config';

const openedMixin = (theme:Theme) => ({
  width: drawerWidth,
  borderRight: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden',
  boxShadow: 'none'
});

const closedMixin = (theme:Theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: 0,
  borderRight: 'none',
  // TODO 
  // boxShadow: theme.customShadows.z1
});

// ==============================|| DRAWER - MINI STYLED ||============================== //

interface Props{
  theme: Theme,
  open: boolean
}
const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({  }:Props) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  // ...(open && {
  //   ...openedMixin(theme),
  //   '& .MuiDrawer-paper': openedMixin(theme)
  // }),
  // ...(!open && {
  //   ...closedMixin(theme),
  //   '& .MuiDrawer-paper': closedMixin(theme)
  // })
}));

export default MiniDrawerStyled;
