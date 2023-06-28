import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
//
import { AnalyticSection, LogSection } from '@/components/pages/dashboard';

export default function DashboardDefault() {

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75} >
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant='h5'>Dashboard</Typography>
      </Grid>
      <Grid item xs={12}>
        <AnalyticSection />
      </Grid>
      <Grid item xs={12}>
        <LogSection />
      </Grid>
    </Grid>
  );
};

