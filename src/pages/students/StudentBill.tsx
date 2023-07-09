import { useState, useEffect, useContext, useRef } from "react";
import { Box, Button, Container } from "@mui/material"
import moment from "moment";
//
import { Bill } from "@/components/pages/students/studentBill"
import { BillItems, FeesType, StudentType } from "@/types"
import { getStudentDetail, getStudentPreviousDue } from "@/services/student.service";
import { useParams } from "react-router-dom";
import { SettingsContext } from "@/context/settings";
import { getStudentCurrentMonthStudentFees } from "@/services/student.service";


export default function StudentBillPage() {
    const { value } = useContext(SettingsContext);
    const billRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [previous_due, setPreviousDue] = useState(0);
    const [student_detail, setStudentDetail] = useState<StudentType | null>(null);
    const [current_month_due, setCurrentMonthDue] = useState<Array<FeesType>>([]);
    const current_month = moment().format("MM");
    const current_date = moment().format('YYYY-MM-DD');
    const [total_sum, setTotalSum] = useState(0);

    const { id } = useParams();

    function calculateTotalSum(){
        const sum = current_month_due.reduce((previous, current, )=>{
            return previous + current.amount
        }, 0);
        setTotalSum(sum);
    }

    function handleClick(){
        console.log(billRef.current?.innerHTML);
        try {
            if(billRef.current){
                iframeRef.current?.contentWindow?.addEventListener('afterprint', function(){
                    iframeRef.current?.contentWindow?.document.open();
                    iframeRef.current?.contentWindow?.document.close();
                })
                iframeRef.current?.contentWindow?.document.write(billRef.current.innerHTML);
                iframeRef.current?.contentWindow?.print();
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(()=>{
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

                    getStudentPreviousDue(parsed_id)
                        .then(data => {
                            if(typeof data === "number"){
                                setPreviousDue(data);
                            }
                        })
                        .catch(error => console.log(error));

                    getStudentCurrentMonthStudentFees(parsed_id)
                        .then(data => {
                            setCurrentMonthDue(data as Array<FeesType>);
                        })
                        .catch(error => console.log(error))
            } else {
                
            }
        }
    }, []);

    return (
        <Container>
            <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' gap={2}>
                <Button variant="contained" onClick={handleClick}>Print</Button>
                <Bill
                    ref={billRef}
                    previous_due={previous_due}
                    total_sum={total_sum}
                    bill_no={1111}
                    month={current_month}
                    student_class={student_detail?.class || ''} 
                    bill_items={current_month_due} 
                    date={current_date} 
                    // student detail
                    student_name={`${student_detail?.first_name} ${student_detail?.last_name}`} 
                    roll_no={student_detail?.roll_no || 0} 
                    // organization detail
                    organization_name={value.organization_name}
                    pan_no={value.pan_no}
                    phone_no={value.phone_no}
                    location={value.location}
                />
                <iframe ref={iframeRef} style={{display:'none'}} ></iframe>
            </Box>
        </Container>
    )
}