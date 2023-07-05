import { useState, useEffect } from "react";
import { GiftOutlined, MessageOutlined, SettingOutlined } from "@ant-design/icons";
import { Avatar, Grid, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
//
import MainCard from "@/components/layouts/MainCard";
import { LogType, log_types } from "@/types";
import { getAppLog } from "@/services/settings.service";
const fakeData: Array<LogType> = [
    { id: 1,type: "system", title: "Dummy Log", description: "lorem lorem lorem lorem", time: '2022-11-10' },
    { id: 2,type: "backup", title: "Dummy Log", description: "lorem lorem lorem lorem", time: '2022-11-10' },
    { id: 3,type: "backup", title: "Dummy Log", description: "lorem lorem lorem lorem", time: '2022-11-10' },
    { id: 4,type: "charge generate", title: "Dummy Log", description: "lorem lorem lorem lorem", time: '2022-11-10' },
    { id: 5,type: "charge generate", title: "Dummy Log", description: "lorem lorem lorem lorem", time: '2022-11-10' },
    { id: 6,type: "charge generate", title: "Dummy Log", description: "lorem lorem lorem lorem", time: '2022-11-10' },
    { id: 7,type: "system", title: "Dummy Log", description: "lorem lorem lorem lorem", time: '2022-11-10' },


];
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

function getListIcon(type: log_types) {
    if (type === "charge generate") {
        return <MessageOutlined />
    }
    if (type === "backup") {
        return <GiftOutlined />
    }
    if (type === "system") {
        return <SettingOutlined />
    }
    return <></>
}

function getIconStyle(type: log_types) {
    if (type === "charge generate") {
        return {
            color: 'success.main',
            bgcolor: 'success.lighter'
        }
    }
    if (type === "backup") {
        return {
            color: 'error.main',
            bgcolor: 'error.lighter'
        }
    }
    if (type === "system") {
        return {
            color: 'primary.main',
            bgcolor: 'primary.lighter'
        }
    }
    return {}
}

export default function LogSection() {
    const [logs, setLogs] = useState(fakeData);
    useEffect(() => {
        // TODO set system logs
        getAppLog()
            .then((data) => {
                console.log(data);
            })
            .catch(error => console.log(error))
    }, [])
    return (
        <Grid container alignItems='center' justifyContent='space-between'>
            <Grid item xs={12}>
                <Typography variant="h5">System Log</Typography>
            </Grid>
            <Grid item xs={12}>
                <MainCard sx={{ mt: 2 }} cardContent={false}>
                    <List component="nav" sx={{
                        px: 0,
                        py: 0,
                        '& .MuiListItemButton-root': {
                            py: 1.5,
                            '& .MuiAvatar-root': avatarSX,
                            '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                        }
                    }}>
                        {
                            logs.map((item) => (
                                <ListItemButton key={item.id} divider>
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={getIconStyle(item.type)}
                                        >
                                            {getListIcon(item.type)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={<>
                                        <Typography variant="subtitle1">{item.title}</Typography> {item.time}
                                    </>} secondary={item.description} />
                                </ListItemButton>
                            ))
                        }
                    </List>
                </MainCard>
            </Grid>
        </Grid>
    )
}