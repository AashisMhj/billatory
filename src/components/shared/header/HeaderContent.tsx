// material-ui
import { Box,  Theme, useMediaQuery } from '@mui/material';

// project import
// import Search from './Search';
import HeaderTitle from './HeaderTitle';
import Profile from './profile';
import MobileSection from './MobileSection';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme:Theme) => theme.breakpoints.down('md'));

  return (
    <>
      {!matchesXs && <HeaderTitle />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
