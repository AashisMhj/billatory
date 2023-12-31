import { Typography, useTheme } from "@mui/material";

export default function WelcomeSection() {
    const theme = useTheme();
    return (
        <div style={{ height: '250px', padding: '10px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'end', justifyContent: 'end', height: '100%' }}>
                <div style={{ backgroundColor: theme.palette.primary[100], width: '100%', padding: '100px', borderRadius: '10px', height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ maxWidth: '700px',  height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h2" color={theme.palette.primary[700]}>Welcome Back to Your Dashboard</Typography>
                        <Typography variant="h4">Greetings Fellow User</Typography>
                    </div>
                </div>
                <img src="/user-with-laptop.png" className="dashboard-image" style={{ position: 'absolute', height: '230px', right: '100px' }} alt="" />
            </div>
        </div>
    )
}