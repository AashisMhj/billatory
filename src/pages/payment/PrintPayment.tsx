import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Box, Button, Container, Grid } from "@mui/material";
//
import { PaymentSlip } from "@/components/pages/payment/printPayment";
import { getPaymentDetail } from "@/services/payment.service";
import { PaymentType } from "@/types";
import { SettingsContext } from "@/context/settings";
import { convertToWords } from "@/utils/helper-function";
import '@/components/pages/payment/printPayment/payment-slip.css';


export default function PrintPaymentPage() {
    const { id } = useParams();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const slipRef = useRef<HTMLDivElement>(null);
    const current_date = moment().format('YYYY-MM-DD');

    const [payment_info, setPaymentInfo] = useState<PaymentType>({
        amount: 0,
        student_id: 0,
        created_at: '',
        class_id: 0,
        id: 0,
    });
    const { value } = useContext(SettingsContext);

    function printDocument() {
        try {
            if (slipRef.current) {
                iframeRef.current?.contentWindow?.addEventListener('afterprint', function () {
                    iframeRef.current?.contentWindow?.document.open();
                    iframeRef.current?.contentWindow?.document.close();
                })
                iframeRef.current?.contentWindow?.document.write(slipRef.current.innerHTML);
                iframeRef.current?.contentWindow?.print();
            }
        } catch (error) {
            console.log(error);

        }

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
    }, []);




    return (
        <Container>
            <Box>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={printDocument} >Print</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <PaymentSlip
                            ref={slipRef}
                            organization_name={value.organization_name}
                            amount={payment_info.amount}
                            current_date={current_date}
                            amount_words={convertToWords(payment_info.amount)}
                            location={value.location}
                            pan_no={value.pan_no}
                            payee={'Jhon Doe'}
                            payment_id={payment_info.id}
                            phone_no={value.phone_no}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <iframe ref={iframeRef} width="100%" style={{ aspectRatio: '3/1', display: 'none' }}></iframe>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}