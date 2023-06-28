import { useState, useEffect } from "react";
import MainCard from "@/components/layouts/MainCard";
import { Avatar, Grid, List, ListItemAvatar, ListItemButton, ListItemSecondaryAction, ListItemText, Stack, Typography } from "@mui/material";
import { LogType, log_types } from "@/types";
import { GiftOutlined, MessageOutlined, SettingOutlined } from "@ant-design/icons";
const fakeData: Array<LogType> = [
    { type: "system", title: "Dummy Log", description: "lorem lorem lorem lorem", time: '2022-11-10' },
    { type: "backup", title: "Dummy Log", description: "lorem lorem lorem lorem", time: '2022-11-10' },
    { type: "backup", title: "Dummy Log", description: "lorem lorem lorem lorem", time: '2022-11-10' },
    { type: "charge generate", title: "Dummy Log", description: "lorem lorem lorem lorem", time: '2022-11-10' },
    { type: "charge generate", title: "Dummy Log", description: "lorem lorem lorem lorem", time: '2022-11-10' },
    { type: "charge generate", title: "Dummy Log", description: "lorem lorem lorem lorem", time: '2022-11-10' },
    { type: "system", title: "Dummy Log", description: "lorem lorem lorem lorem", time: '2022-11-10' },


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
                                <ListItemButton divider>
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