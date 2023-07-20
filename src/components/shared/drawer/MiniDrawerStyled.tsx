// material-ui
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import { Theme } from '@mui/material/styles';

// project import
import { drawerWidth } from '@/config';


interface Props{
  theme: Theme,
  open: boolean
}


const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({open, theme  }:Props) => {
  if(open){
    return {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      borderRight: `1px solid ${theme.palette.divider}`,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      }),
      overflowX: 'hidden',
      boxShadow: theme.customShadows.drawer
    }
  }else{
    return {
      width: 0,
      flexShrink: 0,
      display: 'none',
      whiteSpace: 'nowrap',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      overflowX: 'hidden',
      borderRight: 'none',
      boxShadow: theme.customShadows.z1
    }
  }
});

export default MiniDrawerStyled;
