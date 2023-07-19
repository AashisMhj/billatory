import { Paper } from "@mui/material";
import { ReactNode } from "react";

export default function FormContainer({children}:{children:ReactNode}){
    return <Paper sx={{padding: '40px', marginTop: '10px'}}>
        {children}
    </Paper>
}