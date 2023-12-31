import { Grid, Stack, Typography } from '@mui/material';

import {SetupWrapper} from '@/components/pages/setup'
import { LoginForm } from '@/components/pages/login';

export default function LoginPage() {
    return (
        <SetupWrapper>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                        <Typography variant="h3">Login</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <LoginForm />
                </Grid>
            </Grid>
        </SetupWrapper>
    )
}