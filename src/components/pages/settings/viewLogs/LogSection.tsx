import { useState, useEffect } from "react";
import { GiftOutlined, MessageOutlined, SettingOutlined } from "@ant-design/icons";
import { Avatar, Grid, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
//
import MainCard from "@/components/layouts/MainCard";
import { LogType, log_types } from "@/types";
import { getAppLog } from "@/services/settings.service";

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
    if (type === "INFO") {
        return <MessageOutlined />
    }
    if (type === "ERROR") {
        return <GiftOutlined />
    }
    if (type === "WARN") {
        return <SettingOutlined />
    }
    return <></>
}

function getIconStyle(type: log_types) {
    if (type === "INFO") {
        return {
            color: 'success.main',
            bgcolor: 'success.lighter'
        }
    }
    if (type === "ERROR") {
        return {
            color: 'error.main',
            bgcolor: 'error.lighter'
        }
    }
    if (type === "WARN") {
        return {
            color: 'primary.main',
            bgcolor: 'primary.lighter'
        }
    }
    return {}
}

function convertToLogType(value: string): log_types {
    if (value === "ERROR" || value === "INFO" || value === "WARN") {
      return value as log_types;
    } else {
      return "ERROR";
    }
  }

export default function LogSection() {
    const [logs, setLogs] = useState<Array<LogType>>([]);
    useEffect(() => {
        getAppLog()
            .then((data) => {
                if (typeof data === "string") {
                    const lines = data.split('\n');
                    const logs: Array<LogType | null> = lines.map((item, index) => {
                        const regex = /^\[(\d{4}-\d{2}-\d{2})\]\[(\d{2}:\d{2}:\d{2})\]\[(\w+)\]\[(\w+)\]\s(.*)$/;
                        const matches = regex.exec(item);
                        if (matches) {
                            const date = matches[1];
                            const time = matches[2];
                            const error = matches[3];
                            // const module = matches[4];
                            const message = matches[5];
                            const log:LogType = {
                                id: index,
                                title: message,
                                time: `${date} ${time}`,
                                description: '',
                                type: convertToLogType(error ) || "error",

                            }
                            return log;
                        } else {
                            return null
                        }

                    });
                    const filtered_logs:Array<LogType> = logs.filter((item):item is LogType => item !== null).reverse().slice(0, 25);
                    setLogs(filtered_logs);
                }
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
                            logs.map((item, index) => (
                                <ListItemButton key={item.id} divider>
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={getIconStyle(item.type)}
                                        >
                                            {getListIcon(item.type)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={<>
                                        <Typography variant="subtitle1">{index+1}: {item.title}</Typography> {item.time}
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