import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Logo from '@/assets/billatory-logo.png';
import { LinearProgress } from '@mui/material';

export default function LoadingPage() {


    return (
        <Container maxWidth="sm">
            <Grid container direction="column" alignItems="center" justifyContent="center" spacing={2} style={{ height: '100vh' }}>
                <Grid item>
                    <Paper style={{ width: '120px', height: '120px', padding: '16px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                            <img src={Logo} alt="Logo" style={{ width: '150px', height: '100px' }} />
                        </div>
                    </Paper>

                </Grid>
                <Grid item>
                    <LinearProgress />
                    <Typography variant="body1">Loading...</Typography>
                </Grid>
            </Grid>
        </Container>
    );

}