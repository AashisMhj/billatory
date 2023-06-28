import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
//
import AnalyticCard from "./AnalyticCard";
import {addComma} from '@/utils/helper-function';

export default function AnalyticSection(){
    const [total_student, setTotalStudents] = useState(34500);
    const [total_classes, setTotalClasses] = useState(10);
    const [monthly_payment, setMonthlyPayment] = useState(12000);
    const [monthly_charge, setMonthlyCharge] = useState(11000);

    useEffect(()=>{
        // TODO feature get the data for stats
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