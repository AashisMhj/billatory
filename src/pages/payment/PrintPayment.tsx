import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Container, Grid } from "@mui/material";
//
import { PaymentSlip } from "@/components/pages/payment/printPayment";
import { getPaymentDetail } from "@/services/payment.service";
import { PaymentType } from "@/types";
import { SettingsContext } from "@/context/settings";

export default function PrintPaymentPage() {
    const { id } = useParams();
    const paymentRef = useRef<HTMLDivElement>();
    const [payment_info, setPaymentInfo] = useState<PaymentType>({
        amount: 0,
        student_id: 0,
        created_at: '',
        class_id: 0,
        id: 0,
    });
    const { value } = useContext(SettingsContext);

    function printDocument(){
        console.log(paymentRef.current?.innerText);
    }

    useEffect(() => {
        if (id) {
            const payment_id = parseInt(id);
            if (payment_id) {
                getPaymentDetail(payment_id)
                    .then((data) => {
                        console.log(data);
                        setPaymentInfo(data as PaymentType);
                    })
                    .catch(err => console.log(err));
            }
        }
    }, [])
    return (
        <Container>
            <Box>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <PaymentSlip ref={paymentRef}  organization_name={value.organization_name} amount={payment_info?.amount || 0} location={value.location} pan_no={value.pan_no} payment_id={parseInt(id || "0")} phone_no={value.phone_no} student_id={payment_info.student_id} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={printDocument} >Print</Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}