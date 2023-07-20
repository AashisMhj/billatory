import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import NepaliDate from "nepali-date-converter";
//
import AnalyticCard from "./AnalyticCard";
import {addComma} from '@/utils/helper-function';
import { getStudentRowCount } from "@/services/student.service";
import { getClassRowCount } from "@/services/class.service";
import { getMonthlyFee, getMonthlyPayment } from "@/services/fees.service";
import CorporateFareOutlined from "@mui/icons-material/CorporateFareOutlined";
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import MonetizationOnOutlined from '@mui/icons-material/MonetizationOnOutlined';
import FeedOutlined from '@mui/icons-material/FeedOutlined';

export default function AnalyticSection(){
    const [total_student, setTotalStudents] = useState(0);
    const [total_classes, setTotalClasses] = useState(0);
    const [monthly_payment, setMonthlyPayment] = useState(0);
    const [monthly_charge, setMonthlyCharge] = useState(0);
    const d = new NepaliDate( Date.now());

    useEffect(()=>{
        const current_nepali_month = d.getMonth() + 1;
        const current_nepali_year = d.getYear();
        getStudentRowCount(true)
            .then((student_count) => {
                if(typeof student_count === "number"){
                    setTotalStudents(student_count);
                }
            })
            .catch(error => console.error(error));

        getClassRowCount()
            .then((class_count) =>{
                if(typeof class_count === "number"){
                    setTotalClasses(class_count);
                }
            } )
            .catch(error => console.error(error));

        getMonthlyFee(current_nepali_month, current_nepali_year)
            .then(data => {
                if(typeof data === "number"){
                    setMonthlyCharge(data);
                }
            })
            .catch(error => console.error(error));

        getMonthlyPayment(current_nepali_month, current_nepali_year)
            .then(data => {
                if(typeof data === "number"){
                    setMonthlyPayment(data);
                }
            })
            .catch(error => console.error(error));
        
    })

    return <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticCard title="Total Students" icon={<CorporateFareOutlined fontSize="large" color="primary" />} count={addComma(total_student)} color='primary' />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticCard title="Total Classes" icon={<PersonOutlined fontSize="large" color="primary" />} count={addComma(total_classes)} color='primary' />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticCard title="Months Payment" icon={<MonetizationOnOutlined fontSize="large" color="info" />} count={addComma(monthly_payment)} color='info' />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticCard title="Months Due" icon={<FeedOutlined fontSize="large" color="warning" />} count={addComma(monthly_charge)} color='warning' />
        </Grid>
    </Grid>
}