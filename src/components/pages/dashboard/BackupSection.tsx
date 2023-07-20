import { useState, useContext } from "react";
import { Box, Button } from "@mui/material";
//
import { SnackBarContext } from "@/context/snackBar";
import { backupData } from "@/services/settings.service";
import BackupIcon from '@mui/icons-material/Backup';


export default function BackupSection(){
    const [is_loading, setIsLoading] = useState(false);
    const {showAlert} = useContext(SnackBarContext);

    function handleClick(){
        setIsLoading(true);
        backupData()
            .then(data => {
                showAlert('Backup saved at '+data, 'success');
                console.error(data);
            })
            .catch(err => {
                console.error(err)
                showAlert('Failed to Backup Data', 'error');
            })
            .finally(()=> setIsLoading(false))
    }

    return <Box display='flex' justifyContent='center' alignItems='center'>
        <Button variant="contained" color="error" size="large" disabled={is_loading} onClick={handleClick} startIcon={<BackupIcon />}>Backup Database</Button>
    </Box>
}