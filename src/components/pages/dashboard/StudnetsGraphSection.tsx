import MainCard from '@/components/layouts/MainCard';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import StudentGraph from './StudentGraph';

export default function StudentsGraphSection() {
  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Students Count</Typography>
        </Grid>
      </Grid>
      <MainCard cardContent={false} sx={{mt: 1.5}}>
        <StudentGraph />
      </MainCard>
    </>
  )
}