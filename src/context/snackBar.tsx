import {createContext, useState, ReactNode} from "react";
import { AlertColor } from "@mui/material";

export type SnackBarContextValue = {
    message: string,
    message_type: AlertColor,
    is_open: boolean,
    setSnackBarStatus: (status:boolean) => void,
    showAlert: (message:string, message_type:AlertColor) => void
}

export const SnackBarContext = createContext<SnackBarContextValue>({
    message: '',
    message_type: 'error',
    is_open: false,
    setSnackBarStatus: () => null,
    showAlert: () => null
});

export const SnackBarProvider = ({children}:{children:ReactNode})=>{
    const [message, setMessage] = useState('');
    const [message_type, setMessageType] = useState<AlertColor>('success');
    const [is_open, setOpen] = useState(false);

    const showAlert = (message:string, message_type:AlertColor) => {
        setOpen(true);
        setMessageType(message_type);
        setMessage(message);

    }
    function setSnackBarStatus(new_status:boolean){
        setOpen(new_status);
    }
    return <SnackBarContext.Provider value={{ is_open,message, message_type, showAlert, setSnackBarStatus}}>
        {children}
    </SnackBarContext.Provider>

}