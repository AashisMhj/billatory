// material-ui
import { Box, IconButton, Link, Theme, useMediaQuery } from '@mui/material';

// project import
// import Search from './Search';
import HeaderTitle from './HeaderTitle';
import Profile from './profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme:Theme) => theme.breakpoints.down('md'));

  return (
    <>
      {!matchesXs && <HeaderTitle />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      <Notification />
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
