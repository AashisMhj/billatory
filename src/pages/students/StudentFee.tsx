import { Container } from "@mui/material";
import { getFees } from "@/services/fees.service";
import { useEffect, useState } from "react";
import { FeesType } from "@/types";

export default function StudentFeePage(){
    const [fees, setFees] = useState();
    useEffect(()=>{
        getFees(1, 100, true)
            .then((data) =>{
                console.log(data);
            })
            .catch(error => console.log(error));
    }, []);
    return (
        <Container>

        </Container>
    )
}