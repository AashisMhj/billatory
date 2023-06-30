import { useContext } from "react";
import { SnackBarContext } from "@/context/snackBar";
import { Alert, Snackbar } from "@mui/material";

export default function AppAlert() {

    const { is_open, message, message_type,setSnackBarStatus  } = useContext(SnackBarContext);

    return (
        <Snackbar open={is_open} autoHideDuration={6000} onClose={() => setSnackBarStatus(false)} anchorOrigin={{vertical: 'top', horizontal: 'center'}} sx={{width: '100%'}}>
            <Alert onClose={() => setSnackBarStatus(false)} severity={message_type} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )

}