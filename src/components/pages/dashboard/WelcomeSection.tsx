import MainCard from "@/components/layouts/MainCard";
import { Box, Grid, Typography, useTheme } from "@mui/material";

export default function WelcomeSection() {
    const theme = useTheme();
    return (
        <Box height="300px" display='flex' alignItems='flex-end' width="100%">
            <MainCard sx={{ backgroundColor: theme.palette.primary[200], width: "100%"}} >
                <Grid container>
                    <Grid item xs={8}>
                        <Box display='flex' flexDirection='column' justifyContent='space-between'>
                            <Typography variant="h3" color={theme.palette.primary[700]}>Welcome Back to Your Dashboard</Typography>
                            <Typography>Greetings Account Name</Typography>
                        </Box>
                    </Grid>
                    <Grid item lg={4} md={0}>
                        <Box position='relative' >
                            <img height="300px" width="300px" style={{position: 'absolute'}}   src="/user-with-laptop.png" />
                        </Box>
                    </Grid>
                </Grid>
            </MainCard>
        </Box>
    )
}