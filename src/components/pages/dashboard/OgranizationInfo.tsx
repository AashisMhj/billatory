import { Box, Card, CardContent, CardMedia, Container, Grid, Typography } from "@mui/material";
import { useContext } from "react";
//
import { SettingsContext } from "@/context/settings";

export default function OrganizationInfoSection() {
    const { value } = useContext(SettingsContext);

    return (
        <Container>
            <Box display="flex" justifyContent="center">
                <Card sx={{ display: 'flex', maxWidth: '800px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardMedia component="img" sx={{ width: 190 }} image={value.image} alt={value.organization_name} />
                    </Box>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h5">{value.organization_name}</Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">{value.location}</Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">{value.phone_no}</Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">{value.pan_no}</Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">{value.email || ''}</Typography>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    )
}