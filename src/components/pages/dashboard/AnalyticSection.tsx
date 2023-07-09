import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
//
import AnalyticCard from "./AnalyticCard";
import {addComma} from '@/utils/helper-function';
import { getStudentRowCount } from "@/services/student.service";
import { getClassRowCount } from "@/services/class.service";
import { getMonthlyFee, getMonthlyPayment } from "@/services/fees.service";

export default function AnalyticSection(){
    const [total_student, setTotalStudents] = useState(0);
    const [total_classes, setTotalClasses] = useState(0);
    const [monthly_payment, setMonthlyPayment] = useState(0);
    const [monthly_charge, setMonthlyCharge] = useState(0);

    useEffect(()=>{
        getStudentRowCount()
            .then((student_count) => {
                if(typeof student_count === "number"){
                    setTotalStudents(student_count);
                }
            })
            .catch(error => console.log(error));

        getClassRowCount()
            .then((class_count) =>{
                if(typeof class_count === "number"){
                    setTotalClasses(class_count);
                }
            } )
            .catch(error => console.log(error));

        getMonthlyFee()
            .then(data => {
                if(typeof data === "number"){
                    setMonthlyCharge(data);
                }
            })
            .catch(error => console.log(error));

        getMonthlyPayment()
            .then(data => {
                if(typeof data === "number"){
                    setMonthlyPayment(data);
                }
            })
            .catch(error => console.log(error));
        
    })

    return <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticCard title="Total Students" count={addComma(total_student)} color='primary' />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticCard title="Total Classes" count={addComma(total_classes)} color='primary' />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticCard title="Monthly Payment" count={addComma(monthly_payment)} color='info' />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticCard title="Months Payment" count={addComma(monthly_charge)} color='warning' />
        </Grid>
    </Grid>
}