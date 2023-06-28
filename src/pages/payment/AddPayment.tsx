import { useEffect, useState } from "react";
import { Box, Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import * as Yup from 'yup';
//
import { getStudents } from "@/services/student.service";
import { addPayment } from "@/services/payment.service";
import { StudentType } from "@/types";
import AnimateButton from "@/components/@extended/AnimateButton";


export default function AddPaymentPage() {
    const [students, setStudents] = useState<Array<StudentType>>([]);

    useEffect(() => {
        getStudents(1, 100)
            .then(data => {
                if (typeof data === "string") {
                    const student_data = JSON.parse(data);
                    setStudents(student_data);
                }
            })
            .catch(err => {
                console.log(err);
            })
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
                            remark: values.remarks
                        })
                            .then((data) => {
                                console.log(data);
                            })
                            .catch(err => {
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
                                        <InputLabel htmlFor="amount">First Name</InputLabel>
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