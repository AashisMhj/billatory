import { useEffect, useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';

// project import
import { Header, Drawer, AppAlert } from '@/components/shared';
import { SideBarContext } from '@/context/sideBar';


const MainLayout = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { is_open, openDrawer } = useContext(SideBarContext)

  // drawer toggler
  const [open, setOpen] = useState(is_open);

  const handleDrawerToggle = () => {
    setOpen(!open);
    openDrawer(!open)
  };

  // set media wise responsive drawer
  useEffect(() => {
    setOpen(!matchDownLG);
    openDrawer(!matchDownLG)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  useEffect(() => {
    if (open !== is_open) setOpen(is_open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is_open]);

  return (
    <>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Header open={open} handleDrawerToggle={handleDrawerToggle} />
        <Drawer open={open} handleDrawerToggle={handleDrawerToggle} window={window} />
        <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
          <Toolbar />
          <Box paddingTop={2} paddingLeft={2} marginLeft={2} marginRight={2} paddingRight={2}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      <AppAlert />
    </>
  );
};

export default MainLayout;
