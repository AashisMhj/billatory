import { Box, Container, Grid, Typography } from "@mui/material";
import { useContext } from "react";
//
import { SettingsContext } from "@/context/settings";

export default function OrganizationInfoSection() {
    const { value } = useContext(SettingsContext);

    return <>
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <img src={value.image} height="300px" width="300px" />
            </Grid>
            <Grid item xs={9}>
                <Typography variant="h2">{value.organization_name}</Typography>
                <Typography variant="h6">{value.location}</Typography>
                <Typography variant="h6" >{value.pan_no}</Typography>
                <Typography variant="h6" >{value.phone_no}</Typography>

            </Grid>
        </Grid>
    </>
}