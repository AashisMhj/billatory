import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Container } from "@mui/material";
//
import { PaymentSlip } from "@/components/pages/payment/printPayment";
import { getPayments } from "@/services/payment.service";

export default function PrintPaymentPage(){
    const {id} = useParams();

    useEffect(()=>{
        if(id){
            getPayments
        }
    })
    return (
        <Container>
            <Box>
                <PaymentSlip />
            </Box>
        </Container>
    )
}