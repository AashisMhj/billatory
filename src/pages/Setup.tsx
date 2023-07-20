import { Link } from 'react-router-dom';
import { Grid, Stack, Typography } from '@mui/material';

import {SetupWrapper, Form} from '@/components/pages/setup'

export default function SetUpPage() {
    return (
        <SetupWrapper>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                        <Typography variant="h3">System Setup</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Form />
                </Grid>
            </Grid>
        </SetupWrapper>
    )
}