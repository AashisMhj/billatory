import { useState, useContext, useRef } from "react";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { Box, Button, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, Stack, SxProps, Typography } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import NepaliDate from "nepali-date-converter";
//
import { StudentsTableFilterType, StudentClassType, FeesType, StudentType } from "@/types";
import { getStudentCurrentMonthStudentFees, getStudentDetail, getStudentPreviousDue } from "@/services/student.service";
import { SettingsContext } from "@/context/settings";
import { SnackBarContext } from "@/context/snackBar";
import { Months } from "@/utils/constants";
import { getBillPageLayout, billFrame } from "@/utils/template-helpers";

interface Props {
    open: boolean,
    handleClose: () => void,
    onSubmit: (value: StudentsTableFilterType) => void,
    student_ids: Array<number>
}
const style: SxProps = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'white',
    border: '2px solid #000',
    p: 4
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
            if(! iframeRef.current?.contentWindow){
                throw Error('Content window not found')
            }
            for (let id of student_ids) {
                const data = await getStudentDetail(id);
                if (typeof data === "string") {
                    const student_detail = JSON.parse(data) as StudentType;
                    const previous_due = await getStudentPreviousDue(id, nepali_month, nepali_year) as number;
                    const current_month_fee = await getStudentCurrentMonthStudentFees(id, nepali_month, nepali_year) as Array<FeesType>
                    let total_sum = current_month_fee.reduce((previous, current,) => {
                        return previous + current.amount
                    }, 0);
                    content += billFrame({
                        previous_due: previous_due,
                        total_sum: total_sum,
                        bill_no: 0,
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
                    })
                }
            }
            const bill = getBillPageLayout(content);
            iframeRef.current?.contentWindow?.document.open();
            iframeRef.current?.contentWindow?.document.write(bill);
            iframeRef.current?.contentWindow?.document.close();
            iframeRef.current?.contentWindow?.print();
        } catch (error) {
            console.log(error);
            showAlert('Error '+error, 'error');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant="h5" >Print</Typography>
                    <IconButton onClick={() => handleClose()}>
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
                <iframe ref={iframeRef} style={{display: 'none'}}></iframe>
            </Box>
        </Modal>
    )
}