import { Paper } from "@mui/material";
import { ReactNode } from "react";
import MainCard from "./MainCard";

export default function FormContainer({children}:{children:ReactNode}){
    return <MainCard boxShadow sx={{padding: '40px', marginTop: '10px'}}>
        {children}
    </MainCard>
}