import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
//
import { AnalyticSection, OrganizationInfo, BackupSection, WelcomeSection, Report, StudentGraphSection } from '@/components/pages/dashboard';
import MainCard from '@/components/layouts/MainCard';

export default function DashboardDefault() {

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75} >
      <Grid item xs={12}>
        <WelcomeSection />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4} >
          <Grid item xs={6}>
            <OrganizationInfo />
          </Grid>
          <Grid item xs={6}>
            <BackupSection />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2} lg={2} md={12} >
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
          <AnalyticSection />
        </Grid>
      </Grid>
      <Grid item xs={10} lg={10} md={12}>
        <MainCard boxShadow sx={{margin: '10px'}}>
          <Report />
        </MainCard>
        <MainCard boxShadow sx={{margin: '10px'}}>
          <StudentGraphSection />
        </MainCard>
      </Grid>
    </Grid>
  );
};

