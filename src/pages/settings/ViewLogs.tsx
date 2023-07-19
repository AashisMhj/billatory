import { LogSection } from "@/components/pages/settings/viewLogs";
import { PageTitle } from "@/components/shared";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

export default function ViewLogsPage() {
    return <Grid container rowSpacing={2} columnSpacing={2}>
        <Grid item xs={12}>
            <PageTitle title="System Log"/>
        </Grid>
        <Grid item xs={12}>
            <Container>
                <LogSection />
            </Container>
        </Grid>
    </Grid>
}