import { useState } from "react";
import { Box, Button } from "@mui/material";
import { backupData } from "@/services/settings.service";

export default function BackupSection(){
    const [is_loading, setIsLoading] = useState(false);

    function handleClick(){
        backupData()
            .then(data => {
                console.log(data);
            })
            .catch(err => console.log(err))
    }

    return <Box>
        <Button variant="outlined" disabled={is_loading} onClick={handleClick}>Backup</Button>
    </Box>
}