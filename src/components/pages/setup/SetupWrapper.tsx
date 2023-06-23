import PropTypes from 'prop-types';
import { ReactNode } from 'react';

// material-ui
import { Box, Grid } from '@mui/material';

// project import
import SetUPCard from './SetUpCard';
import Logo from '@/components/Logo';
import BasicFooter from '@/components/shared/basicFooter/BasicFooter';
// assets
import AuthBackground from '@/assets/images/auth/AuthBackground';
interface Props{
    children: ReactNode
}

const AuthWrapper = ({ children }:Props) => (
  <Box sx={{ minHeight: '100vh' }}>
    <AuthBackground />
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      sx={{
        minHeight: '100vh'
      }}
    >
      <Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
        <Logo to="#" />
      </Grid>
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          container
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: { xs: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' } }}
        >
          <Grid item>
            <SetUPCard>{children}</SetUPCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        <BasicFooter />
      </Grid>
    </Grid>
  </Box>
);

AuthWrapper.propTypes = {
  children: PropTypes.node
};

export default AuthWrapper;
