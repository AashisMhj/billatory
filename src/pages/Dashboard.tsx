import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
//
import { AnalyticSection, OrganizationInfo, BackupSection, WelcomeSection, Report } from '@/components/pages/dashboard';

export default function DashboardDefault() {

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75} >
      <Grid item xs={12}>
        <WelcomeSection />
      </Grid>
      <Grid item xs={12}>
        <AnalyticSection />
      </Grid>
      <Grid item lg={8} sm={12}>
        <Report />
      </Grid>
      <Grid item lg={4} sm={12}>
        <OrganizationInfo />
      </Grid>
    </Grid>
  );
};

