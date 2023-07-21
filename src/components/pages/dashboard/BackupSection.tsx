import { useState, useContext, useEffect } from "react";
import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
//
import { SnackBarContext } from "@/context/snackBar";
import { backupData, getBackUpFiles } from "@/services/settings.service";
import BackupIcon from '@mui/icons-material/Backup';
import MainCard from "@/components/layouts/MainCard";
import { FileImageFilled } from "@ant-design/icons";
import { formatBytes } from "@/utils/helper-function";
interface BackUpFileType {
    name: string,
    file_size: number
}

export default function BackupSection() {
    const [is_loading, setIsLoading] = useState(false);
    const { showAlert } = useContext(SnackBarContext);
    const [backup_files, setBackUpFiles] = useState<Array<BackUpFileType>>([])

    function handleClick() {
        setIsLoading(true);
        backupData()
            .then(data => {
                showAlert('Backup saved at ' + data, 'success');
                fetchData();
            })
            .catch(err => {
                console.error(err)
                showAlert('Failed to Backup Data', 'error');
            })
            .finally(() => setIsLoading(false))
    }

    function fetchData() {
        getBackUpFiles()
            .then(data => {
                const files_list = data as Array<BackUpFileType>;
                const list = files_list.splice(0, 10);
                setBackUpFiles(list)
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        fetchData()
    }, [])

    return <MainCard boxShadow>
        <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' >
            <Button variant="contained" color="error" size="large" disabled={is_loading} onClick={handleClick} startIcon={<BackupIcon />}>Backup Database</Button>
            <List sx={{ width: "100%" }}>
                {
                    backup_files.map((item) => <ListItem key={item.name}>
                        <ListItemAvatar>
                            <Avatar>
                                <FileImageFilled />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.name} secondary={formatBytes(item.file_size)} />
                    </ListItem>)
                }
            </List>
        </Box>
    </MainCard>
}