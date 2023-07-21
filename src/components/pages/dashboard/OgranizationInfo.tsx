import { useContext } from "react";
import { Box, Card, CardContent, CardMedia, Container, Typography, useTheme } from "@mui/material";
//
import { SettingsContext } from "@/context/settings";

export default function OrganizationInfoSection() {
    const { value } = useContext(SettingsContext);
    const theme = useTheme();
    return (
        <Container>
                <Box display="flex" justifyContent="center">
                    <Card sx={{ display: 'flex', maxWidth: '800px', flexDirection: 'column', padding: '5px', borderRadius: '10px', boxShadow: theme.customShadows.card }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <CardMedia component="img" sx={{ width: 190, aspectRatio: '1/1', borderRadius: '50%' }} image={value.image} alt={value.organization_name} />
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