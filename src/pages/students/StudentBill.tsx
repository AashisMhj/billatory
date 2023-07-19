import { useState, useEffect, useContext, useRef } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button"
import NepaliDate from "nepali-date-converter";
import { useParams } from "react-router-dom";
// icons
import PrinterFilledOutlined from "@ant-design/icons/PrinterOutlined";
//
import { FeesType, StudentType } from "@/types"
import { getStudentDetail, getStudentPreviousDue } from "@/services/student.service";
import { SettingsContext } from "@/context/settings";
import { getStudentCurrentMonthStudentFees } from "@/services/student.service";
import { getBillPageLayout, billFrame } from "@/utils/template-helpers";
import { Months } from "@/utils/constants";
import paths from "@/routes/path";
import { PageTitle } from "@/components/shared";


export default function StudentBillPage() {
    const { value } = useContext(SettingsContext);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [previous_due, setPreviousDue] = useState(0);
    const [student_detail, setStudentDetail] = useState<StudentType | null>(null);
    const [current_month_due, setCurrentMonthDue] = useState<Array<FeesType>>([]);
    const [total_sum, setTotalSum] = useState(0);
    const nepali_date = new NepaliDate(Date.now());
    const nepali_month = nepali_date.getMonth() + 1;
    const nepali_year = nepali_date.getYear();

    const { id } = useParams();

    function calculateTotalSum() {
        const sum = current_month_due.reduce((previous, current,) => {
            return previous + current.amount
        }, 0);
        setTotalSum(sum);
    }

    // function handleClick(){
    //     try {
    //         if(billRef.current){
    //             iframeRef.current?.contentWindow?.addEventListener('afterprint', function(){
    //                 iframeRef.current?.contentWindow?.document.open();
    //                 iframeRef.current?.contentWindow?.document.close();
    //             })
    //             iframeRef.current?.contentWindow?.document.write(billRef.current.innerHTML);
    //             iframeRef.current?.contentWindow?.print();
    //         }
    //     } catch (error) {
    //         console.log(error);

    //     }
    // }

    function handleClick() {
        iframeRef.current?.contentWindow?.print();
    }

    useEffect(() => {
        iframeRef.current?.contentWindow?.document.write
        try {
            iframeRef.current?.contentWindow?.document.open();
            iframeRef.current?.contentWindow?.document.close();
            const content = billFrame({
                previous_due: previous_due,
                total_sum: total_sum,
                bill_no: 0,
                month: Months[nepali_month] ? Months[nepali_month].month_name : '',
                student_class: student_detail?.class || '',
                bill_items: current_month_due,
                date: nepali_date.format('YYYY-MM-DD'),
                roll_no: student_detail?.roll_no || 0,
                organization_name: value.organization_name,
                pan_no: value.pan_no,
                phone_no: value.phone_no,
                location: value.location,
                student_name: `${student_detail?.first_name} ${student_detail?.last_name}`,
            });
            iframeRef.current?.contentWindow?.document.write(getBillPageLayout(content));
        } catch (error) {

        }
    }, [student_detail, total_sum])

    useEffect(() => {
        calculateTotalSum();
    }, [student_detail])

    useEffect(() => {

        if (id) {
            const parsed_id = parseInt(id);
            if (parsed_id) {
                getStudentDetail(parsed_id)
                    .then((data) => {
                        if (typeof data === "string") {
                            const student = JSON.parse(data);
                            setStudentDetail(student);
                        }
                    })
                    .catch(error => console.log(error));

                getStudentPreviousDue(parsed_id, nepali_month, nepali_year)
                    .then(data => {
                        console.log(data);
                        if (typeof data === "number") {
                            setPreviousDue(data);
                        }
                    })
                    .catch(error => {
                        console.log('previous');
                        console.log(error)
                    });

                getStudentCurrentMonthStudentFees(parsed_id, nepali_month, nepali_year)
                    .then(data => {
                        console.log(data);
                        setCurrentMonthDue(data as Array<FeesType>);
                    })
                    .catch(error => console.log(error))
            } else {

            }
        }
    }, []);

    return (
        <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12}>
                <PageTitle title="Student Bill" actions={
                    <>
                        <Button variant="outlined" endIcon={<PrinterFilledOutlined />} onClick={handleClick}>Print</Button>
                    </>
                } />
            </Grid>
            <Grid item xs={12}>
                <iframe ref={iframeRef} width="100%" style={{ aspectRatio: "1/1.41" }} ></iframe>
            </Grid>
        </Grid>
    )
}