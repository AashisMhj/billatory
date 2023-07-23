import { useContext } from "react";
import { Box, Card, CardContent, CardMedia, Container, Grid, Typography, useTheme } from "@mui/material";
//
import { SettingsContext } from "@/context/settings";

export default function OrganizationInfoSection() {
    const { value } = useContext(SettingsContext);
    const theme = useTheme();
    return (
        <Box display="flex" justifyContent="center" width="100%">
            <Card sx={{ display: 'flex', flexDirection: 'row', padding: '30px', borderRadius: '10px', width: "100%", boxShadow: theme.customShadows.card }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CardMedia component="img" sx={{ width: 190, aspectRatio: '1/1', borderRadius: '50%' }} image={value.image} alt={value.organization_name} />
                </Box>
                <CardContent sx={{ flex: '1 0 auto' }} >
                    <Typography component="div" variant="h4">{value.organization_name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">{value.location}</Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">{value.phone_no}</Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">{value.pan_no}</Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">{value.email || ''}</Typography>
                </CardContent>
            </Card>
        </Box>
    )
}