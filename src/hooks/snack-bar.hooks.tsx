import { useContext } from "react";
import { AlertColor } from "@mui/material";
//
import { SnackBarContext } from "@/context/snackBar";

export default function useSnackbar(message:string, status:AlertColor){
    const {showAlert} = useContext(SnackBarContext);
    showAlert(message, status);
}