import { useEffect, useState, useContext, useRef } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import moment from "moment";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
// icons
import LeftCircleOutlined from "@ant-design/icons/LeftCircleOutlined";
import PrinterFilledOutlined from "@ant-design/icons/PrinterOutlined";
//
// import { PaymentSlip } from "@/components/pages/payment/printPayment";
import { getPaymentDetail } from "@/services/payment.service";
import { PaymentType } from "@/types";
import { SettingsContext } from "@/context/settings";
import { convertToWords } from "@/utils/helper-function";
import '@/components/pages/payment/printPayment/payment-slip.css';
import paymentFrame from "@/components/pages/payment/PaymentTemplate";
import paths from "@/routes/path";
import { PageTitle } from "@/components/shared";


export default function PrintPaymentPage() {
    const { id } = useParams();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const current_date = moment().format('YYYY-MM-DD');

    const [payment_info, setPaymentInfo] = useState<PaymentType>({
        amount: 0,
        student_id: 0,
        created_at: '',
        class_id: 0,
        id: 0,
        account_name: '',
        payee: ''
    });
    const { value } = useContext(SettingsContext);

    function printDocument() {
        try {
            iframeRef.current?.contentWindow?.addEventListener('afterprint', function () {

            })
            iframeRef.current?.contentWindow?.print();
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        iframeRef.current?.contentWindow?.document.open();
        iframeRef.current?.contentWindow?.document.close();
        iframeRef.current?.contentWindow?.document.write(paymentFrame({
            organization_name: value.organization_name,
            amount: payment_info.amount,
            current_date: current_date,
            amount_words: convertToWords(payment_info.amount),
            location: value.location,
            pan_no: value.pan_no,
            payee: payment_info.payee,
            payment_id: payment_info.id,
            phone_no: value.phone_no,
            account_name: payment_info.account_name
        }));

    }, [payment_info]);


    useEffect(() => {
        if (id) {
            const payment_id = parseInt(id);
            if (payment_id) {
                getPaymentDetail(payment_id)
                    .then((data) => {
                        setPaymentInfo(data as PaymentType);
                    })
                    .catch(err => console.error(err));
            }
        }
    }, []);

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <PageTitle title="Print Payment" actions={
                        <Button variant="contained" onClick={printDocument} endIcon={<PrinterFilledOutlined />} >Print</Button>
                    } />
                </Grid>
                <Grid item xs={12}>
                    <Container>
                        <iframe ref={iframeRef} width="100%" style={{ aspectRatio: "1/1" }}></iframe>
                    </Container>
                </Grid>
            </Grid>
        </Box>
    )
}