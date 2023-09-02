import { useState, useContext, useRef, useEffect } from "react";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { Box, Button, IconButton, Modal, SxProps, Typography } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import NepaliDate from "nepali-date-converter";
//
import {  FeesType, StudentType } from "@/types";
import { getStudentCurrentMonthStudentFees, getStudentDetail, getStudentPreviousDue } from "@/services/student.service";
import { SettingsContext } from "@/context/settings";
import { SnackBarContext } from "@/context/snackBar";
import { Months } from "@/utils/constants";
import {  billFrame, getBulkBillPageLayout } from "@/utils/template-helpers";
import { addBill, getBillCount } from "@/services/fees.service";

interface Props {
    open: boolean,
    handleClose: () => void,
    onSubmit: () => void,
    student_ids: Array<number>
}
const style: SxProps = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'white',
    borderRadius: '10px',
    p: 4
}

interface BillInsertType {
    studentId: number,
    previous_due: number,
    rollNo: number,
    studentClass: string,
    content: string,
}

export default function BulkPrintModal({ open, handleClose, onSubmit, student_ids }: Props) {
    const [is_loading, setIsLoading] = useState(false);
    const { value } = useContext(SettingsContext);
    const { showAlert } = useContext(SnackBarContext);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    async function handlePrint() {
        const nepali_date = new NepaliDate(Date.now());
        const nepali_month = nepali_date.getMonth() + 1;
        const nepali_year = nepali_date.getYear();
        try {
            let content = '';
            setIsLoading(true);
            if (!iframeRef.current?.contentWindow) {
                throw Error('Content window not found')
            }
            let bill_count = await getBillCount() as number;
            let bill_contents:Array<BillInsertType> = []
            for (let id of student_ids) {
                const data = await getStudentDetail(id);
                if (typeof data === "string") {
                    bill_count = bill_count +1;
                    const student_detail = JSON.parse(data) as StudentType;
                    const previous_due = await getStudentPreviousDue(id, nepali_month, nepali_year) as number;
                    const current_month_fee = await getStudentCurrentMonthStudentFees(id, nepali_month, nepali_year) as Array<FeesType>
                    let total_sum = current_month_fee.reduce((previous, current,) => {
                        return previous + current.amount
                    }, 0);
                    content += billFrame({
                        previous_due: previous_due,
                        total_sum: total_sum,
                        image: value.image,
                        bill_no: bill_count,
                        month: Months[nepali_month] ? Months[nepali_month].month_name : '',
                        student_class: student_detail?.class || '',
                        bill_items: current_month_fee,
                        date: nepali_date.format('YYYY-MM-DD'),
                        roll_no: student_detail?.roll_no || 0,
                        organization_name: value.organization_name,
                        pan_no: value.pan_no,
                        phone_no: value.phone_no,
                        location: value.location,
                        student_name: `${student_detail?.first_name} ${student_detail?.last_name}`,
                    });
                    bill_contents.push({
                        content: JSON.stringify(current_month_fee),
                        previous_due: previous_due,
                        rollNo: student_detail.roll_no || 0,
                        studentClass: student_detail.class || '',
                        studentId: student_detail.id || 0
                    })
                }
            }
            // const bill = getBillPageLayout(content);
            // iframeRef.current?.contentWindow?.document.open();
            // iframeRef.current?.contentWindow?.document.close();
            if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
                const container = iframeRef.current.contentWindow.document.getElementById('content');
                if(container){
                    container.innerHTML = "";
                    container.innerHTML = content;
                }

                // iframeRef.current.contentWindow?.document.write(bill);
                iframeRef?.current?.contentWindow?.print();
                iframeRef.current.contentWindow.addEventListener('afterprint', ()=>{
                    bill_contents.forEach((item) => {
                        addBill(item.studentId, item.previous_due, item.rollNo, item.studentClass, item.content)
                            .then(data => null)
                            .catch(error => console.error(error))
                    })
                    onSubmit();
                    handleClose()
                })
            } else {
                throw Error('No Iframe Ref')
            }
        } catch (error) {
            console.error(error);
            showAlert('Error ' + error, 'error');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current?.contentWindow?.document.open();
            iframeRef.current?.contentWindow?.document.close();
            iframeRef.current?.contentWindow?.document.write(getBulkBillPageLayout());
        }
    }, [iframeRef.current])

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant="h5" >Print</Typography>
                    <IconButton onClick={() => handleClose()} size="large">
                        <CloseCircleOutlined />
                    </IconButton>
                </Box>
                <Box>
                    <Typography variant="h5">
                        Print Bill of {student_ids.length} students ?
                    </Typography>
                </Box>
                <Box display='flex' justifyContent='center' marginTop="10px">
                    <Button variant="contained" disabled={is_loading} onClick={handlePrint} fullWidth > {is_loading ? <CircularProgress /> : "Print"}</Button>
                </Box>
                <iframe ref={iframeRef} style={{display: 'none'}} ></iframe>
            </Box>
        </Modal>
    )
}