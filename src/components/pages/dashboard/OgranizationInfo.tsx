import { useContext } from "react";
import { Box, Card, CardContent, CardMedia, Typography, useTheme } from "@mui/material";
//
import { SettingsContext } from "@/context/settings";

export default function OrganizationInfoSection() {
    const { value } = useContext(SettingsContext);
    const theme = useTheme();
    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', padding: '30px', gap: 2, borderRadius: '10px', width: "100%", height: "100%", justifyContent: "space-evenly", boxShadow: theme.customShadows.z1 }}>
            <Typography component="div" variant="h4" sx={{}}>{value.organization_name}</Typography>
            <Box sx={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CardMedia component="img" sx={{ width: "150px", aspectRatio: '1/1', borderRadius: '50%' }} image={value.image} alt={value.organization_name} />
                </Box>
                <CardContent sx={{ flex: '1 0 auto', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', width: "100%" }} >
                    <Typography width="100%" variant="h5" color="text.secondary" component="div">{value.location}</Typography>
                    <Typography width="100%" variant="h5" color="text.secondary" component="div">{value.phone_no}</Typography>
                    <Typography width="100%" variant="h5" color="text.secondary" component="div">{value.pan_no}</Typography>
                    <Typography width="100%" variant="h5" color="text.secondary" component="div">{value.email || ''}</Typography>
                </CardContent>
            </Box>
        </Card>
    )
}