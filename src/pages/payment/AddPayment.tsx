import { useEffect, useState, useContext } from "react";
import { Box, Button, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select, Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import * as Yup from 'yup';
//

import { getStudents } from "@/services/student.service";
import { addPayment } from "@/services/payment.service";
import { getClasses } from "@/services/class.service";
//
import { SnackBarContext } from "@/context/snackBar";
import { StudentClassType, StudentType } from "@/types";
import AnimateButton from "@/components/@extended/AnimateButton";

type StudentListType = {
    show: boolean
} & StudentType;

export default function AddPaymentPage() {
    const [students, setStudents] = useState<Array<StudentListType>>([]);
    const [classes, setClasses] = useState<Array<StudentClassType>>([]);
    const {showAlert} = useContext(SnackBarContext);

    function filterStudent(selected_class: number | null) {
        const student_records = [...students];
        setStudents(student_records.map((item) => {
            return {
                ...item,
                show: selected_class === null ? true : selected_class === item.class_id
            }
        }))
    }
    useEffect(() => {
        getStudents(1, 5000)
            .then(data => {
                if (typeof data === "string") {
                    const student_data = JSON.parse(data) as Array<StudentType>;
                    if (student_data.length > 0) {
                        setStudents(student_data.map((value) => {
                            return {
                                ...value,
                                show: true
                            }
                        }));
                    }
                }
            })
            .catch(err => console.log(err));
        getClasses(1, 1000)
            .then(data => {
                if (typeof data === "string") {
                    const class_data = JSON.parse(data);
                    setClasses(class_data);
                }
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <Box>
            <Typography variant="h4">Add Payment</Typography>
            <Formik
                initialValues={{
                    student_id: null,
                    amount: 0,
                    remarks: ''
                }}
                validationSchema={Yup.object().shape({
                    student_id: Yup.number().required('Student Name is Required'),
                    amount: Yup.number().required('Please Provide Amount'),
                    remark: Yup.string().trim()
                })}
                onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                    setStatus({ success: false });
                    setSubmitting(true);
                    if (values.student_id) {
                        addPayment({
                            amount: values.amount,
                            student_id: values.student_id,
                            remarks: values.remarks
                        })
                            .then((data) => {
                                showAlert("Payment Added", 'success');
                                setErrors({});
                            })
                            .catch(err => {
                                showAlert('Error Adding Payment', 'error');
                                console.log(err);
                            })
                            .finally(() => {
                                setSubmitting(false);
                            })
                    }

                }}
            >
                {
                    ({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                            <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="student">Class</InputLabel>
                                        <Select onChange={(event) => {
                                            filterStudent(parseInt(event.target.value as string) || null);
                                            return handleChange
                                        }}>
                                            {classes.map((cl) => <MenuItem value={cl.id}>{cl.class}</MenuItem>)}
                                        </Select>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="student">Student Name</InputLabel>
                                        <Select onChange={handleChange} name="student_id">
                                            {students.filter(item => item.show).map((student) => <MenuItem value={student.id}>{`${student.first_name} ${student.last_name} class:${student.class}`}</MenuItem>)}
                                        </Select>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="amount">Payment Amount</InputLabel>
                                        <OutlinedInput id="amount" type="number" value={values.amount} onBlur={handleBlur} onChange={handleChange} name='amount' fullWidth error={Boolean(errors.amount)} />
                                        {
                                            touched.amount && errors.amount && (
                                                <FormHelperText error id="class-error-helper">
                                                    {errors.amount}
                                                </FormHelperText>
                                            )
                                        }
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="remark">Remark</InputLabel>
                                        <OutlinedInput id="remark" type="string" value={values.remarks} onBlur={handleBlur} onChange={handleChange} name='remarks' fullWidth error={Boolean(errors.remarks)} />
                                        {
                                            touched.remarks && errors.remarks && (
                                                <FormHelperText error id="class-error-helper">
                                                    {errors.remarks}
                                                </FormHelperText>
                                            )
                                        }
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                            Add
                                        </Button>
                                    </AnimateButton>
                                </Grid>
                            </Grid>
                        </form>
                    )
                }
            </Formik>
        </Box>
    )
}