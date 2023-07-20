import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MainCard from '@/components/layouts/MainCard';
import { useState } from 'react';
import ReportGraph from './ReportGraph';


export default function ReportSection() {
    const [slot, setSlot] = useState('monthly');
    return (
        <>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Typography variant="h5">Unique Visitor</Typography>
                </Grid>
                <Grid item>
                    <Stack direction="row" alignItems="center" spacing={0}>
                        <Button
                            size="small"
                            onClick={() => setSlot('yearly')}
                            color={slot === 'yearly' ? 'primary' : 'secondary'}
                            variant={slot === 'yearly' ? 'outlined' : 'text'}
                        >
                            Yearly Status
                        </Button>
                        <Button
                            size="small"
                            onClick={() => setSlot('monthly')}
                            color={slot === 'monthly' ? 'primary' : 'secondary'}
                            variant={slot === 'monthly' ? 'outlined' : 'text'}
                        >
                            Monthly Status
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
            <MainCard cardContent={false} sx={{ mt: 1.5 }}>
                <Box sx={{ pt: 1, pr: 2 }}>
                    <ReportGraph slot={slot} />
                </Box>
            </MainCard>
        </>
    )
}