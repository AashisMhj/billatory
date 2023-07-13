
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';

// project import
import DrawerHeader from './drawerHeader';
import DrawerContent from './drawerContent';
import MiniDrawerStyled from './MiniDrawerStyled';
import { drawerWidth } from '@/config';

interface Props {
  open: boolean,
  handleDrawerToggle: () => void,
  window: Window
}
const MainDrawer = ({ open, handleDrawerToggle, window }: Props) => {
  const theme = useTheme();
  // for checking the size of window
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  // responsive drawer container
  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1300 }} aria-label="mailbox folders">
      {!matchDownMD ? (
        <MiniDrawerStyled theme={theme} variant="permanent" open={open} >
          <DrawerHeader open={open} />
          <DrawerContent />
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundImage: 'none',
              boxShadow: 'inherit'
            }
          }}
        >
          {open && <DrawerHeader open={open} />}
          {open && <DrawerContent />}
        </Drawer>
      )}
    </Box>
  );

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1300 }} aria-label="mailbox folders">
      {!matchDownMD ? (
        <MiniDrawerStyled theme={theme} variant="permanent" open={open} >
          <DrawerHeader open={open} />
          <DrawerContent />
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundImage: 'none',
              boxShadow: 'inherit'
            }
          }}
        >
          {open && <DrawerHeader open={open} />}
          {open && <DrawerContent />}
        </Drawer>
      )}
    </Box>
  );
};

export default MainDrawer;
