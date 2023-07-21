import { useState, useEffect, useContext } from 'react';
import { Box, Button, Checkbox, Container, FormControlLabel, Grid, Paper, Typography } from "@mui/material";
import { useParams, Link as RouterLink } from 'react-router-dom';
//
import { SnackBarContext } from '@/context/snackBar';
import { addStudentCharge, getStudentCharges, removeStudentCharge } from "@/services/charge.service";
import { StudentChargeType, StudentType, } from '@/types';
import { getStudentDetail } from '@/services/student.service';
import paths from '@/routes/path';
import { LeftCircleOutlined } from '@ant-design/icons';
import { PageTitle } from '@/components/shared';

export default function ListStudentCharges() {
    const [studentCharges, setStudentCharges] = useState<Array<StudentChargeType>>([]);
    const [student_detail, setStudentDetail] = useState<StudentType | null>(null);
    const { id } = useParams();
    const { showAlert } = useContext(SnackBarContext);

    function handleCheckBoxChange(status: boolean, id: number, chargeId: number, studentId: number) {
        if (status) {
            if (studentId && studentId !== 0) {
                addStudentCharge(studentId, chargeId)
                    .then((data) => {
                        showAlert('Updated', 'success');
                        fetchData();
                    })
                    .catch(err => {
                        console.log(err);
                        showAlert('Error Updating', 'error');
                    })
            }
        } else {
            removeStudentCharge(id)
                .then(data => {
                    showAlert('Updated', 'success');
                    fetchData();
                })
                .catch(err => {
                    console.error(err);
                    showAlert('Error Updating', 'error');
                })
        }
    }

    function fetchData() {
        if (id) {
            const parsed_id = parseInt(id);
            if (parsed_id) {
                getStudentCharges(parsed_id)
                    .then((data) => {
                        setStudentCharges(data as Array<StudentChargeType>);
                    })
                    .catch(error => console.log(error));

                getStudentDetail(parsed_id)
                    .then(data => {
                        if (typeof data === "string") {
                            const student = JSON.parse(data);
                            setStudentDetail(student);
                        }
                    })
            } else {
                showAlert('Failed to parsed Id', 'error');
            }

        }
    }

    useEffect(() => {
        fetchData();
    }, []);



    return (
        <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12}>
                <PageTitle title={`Charges of ${student_detail?.first_name} ${student_detail?.last_name}`} />
            </Grid>
            <Grid item xs={12}>
                <Grid container rowSpacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h6'>Class: {student_detail?.class}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <Grid container padding={6}>
                                {
                                    studentCharges.map((charge) => (
                                        <Grid item key={charge.id} xs={3}>
                                            <FormControlLabel control={<Checkbox value={charge.id} checked={charge.student_id ? true : false} onChange={(_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => handleCheckBoxChange(checked, charge.student_charge_id, charge.id, parseInt(id || "0"))} />} label={
                                                <>
                                                    <Typography variant='body2' display='inline' fontWeight='bold'>{charge.charge_title}</Typography>-{charge.class || ''}
                                                </>
                                            } />
                                        </Grid>
                                    ))

                                }
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}