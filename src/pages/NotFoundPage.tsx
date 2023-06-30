import { Box, Container, Typography } from "@mui/material";
import {Link as RouterLink} from 'react-router-dom';
import paths from "@/routes/path";

export default function NotFoundPage(){
    return (
        <Container>
            <Box height="100vh" width='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                <Typography variant="h1" fontSize='200px' color='primary'>404</Typography>
                <RouterLink to={paths.dashboard}>To Dashboard</RouterLink>
            </Box>
        </Container>
    )
}