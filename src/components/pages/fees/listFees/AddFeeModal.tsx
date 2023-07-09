import { Formik, FormikErrors } from "formik";
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined'
import * as Yup from 'yup';
import { Box, Button, FormHelperText, Grid, IconButton, InputLabel, Modal, OutlinedInput, Select, MenuItem, Stack, SxProps, Typography, SelectChangeEvent } from "@mui/material";
//
import AnimateButton from "@/components/@extended/AnimateButton";
import { ReactNode, useEffect, useState } from "react";
import { getAllActiveStudents } from "@/services/student.service";
import { ChargesType, StudentMiniType } from "@/types";
import { getCharges } from "@/services/charge.service";
import { addFee } from "@/services/fees.service";

interface Props {
    open: boolean,
    handleClose: () => void,
    onSubmit: () => void,
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
export default function EditModal({ open, handleClose, onSubmit }: Props) {
    const [all_students, setAllStudents] = useState<Array<StudentMiniType>>([]);
    const [charges, setCharges] = useState<Array<ChargesType>>([]);

    function handleChargeChange(event: SelectChangeEvent<string>, setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{ amount: number; charge_title: string; student_id: number; charge_id: number; submit: null; }>>) {
        console.log(event.target.value);
        const parsed_id = parseInt(event.target.value);
        const charge_index = charges.findIndex(el => el.id === parsed_id);
        if(charge_index !== -1){

            setFieldValue('charge_id', parsed_id);
            setFieldValue('charge_title',charges[charge_index].charge_title );
            setFieldValue('amount', charges[charge_index].amount)
        }
    }


    useEffect(() => {
        getAllActiveStudents()
            .then((data) => {
                console.log('student');
                console.log(data);
                setAllStudents(data as Array<StudentMiniType>)
            })
            .catch(error => console.log(error))

        getCharges(1, 999999)
            .then(data => {
                if(typeof data === "string"){
                    const charges_data = JSON.parse(data);
                    setCharges(charges_data as Array<ChargesType>)
                }
            })
            .catch(error => console.log(error))
    }, [])
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant="h5" >Add Fee Charge</Typography>
                    <IconButton onClick={() => handleClose()}>
                        <CloseCircleOutlined />
                    </IconButton>
                </Box>
                <Formik initialValues={{ amount: 0, charge_title: '', student_id: 0, charge_id: 0, submit: null }}
                    validationSchema={Yup.object().shape({
                        amount: Yup.number().min(1, "Amount is Required").required("Amount is Required"),
                        charge_title: Yup.string().trim().required("Charge Title is Required"),
                        student_id: Yup.number().min(1, "Please Select a Student").required("Please Select a student"),
                        charge_id: Yup.number().min(1, "Please Select a Charge").required("Please Select a Charge")
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            setStatus({ success: false });
                            console.log(values);
                            addFee(values.amount, values.charge_id, values.student_id, values.charge_title)
                                .then((data) => {
                                    console.log(data)
                                    onSubmit()
                                })
                                .catch(error => console.log(error))
                        } catch (error) {
                            setStatus(false);
                            if (error instanceof Error) {
                                setErrors({ submit: error.message });
                            }
                        }
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="charge">Charge</InputLabel>
                                        <Select id="charge" onChange={(event) => handleChargeChange(event, setFieldValue)} value={values.charge_id+''} >
                                            {
                                                charges.map((item) => <MenuItem key={item.id} value={item.id} >{item.charge_title}-{item.class}</MenuItem>)
                                            }
                                        </Select>
                                        {
                                            touched.charge_id && errors.charge_id && (
                                                <FormHelperText error id="charge_id-error-helper">
                                                    {errors.charge_id}
                                                </FormHelperText>
                                            )
                                        }
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="student">Students</InputLabel>
                                        <Select id="student_id" name="student_id" onChange={handleChange} onBlur={handleBlur} >
                                            {
                                                all_students.map((item) => <MenuItem key={item.id} value={item.id} >{` ${item.first_name} ${item.last_name}`}</MenuItem>)
                                            }
                                        </Select>
                                        {
                                            touched.student_id && errors.student_id && (
                                                <FormHelperText error id="student_id-error-helper">
                                                    {errors.student_id}
                                                </FormHelperText>
                                            )
                                        }
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="amount">Amount</InputLabel>
                                        <OutlinedInput id="amount" autoFocus type="text" value={values.amount} onBlur={handleBlur} onChange={handleChange} name='amount' fullWidth error={Boolean(errors.amount && touched.amount)} />
                                        {
                                            touched.amount && errors.amount && (
                                                <FormHelperText error id="amount-error-helper">
                                                    {errors.amount}
                                                </FormHelperText>
                                            )
                                        }
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="charge_title">Charge Title</InputLabel>
                                        <OutlinedInput id="charge_title" autoFocus type="text" value={values.charge_title} onBlur={handleBlur} onChange={handleChange} name='charge_title' fullWidth error={Boolean(errors.charge_title && touched.charge_title)} />
                                        {
                                            touched.charge_title && errors.charge_title && (
                                                <FormHelperText error id="charge_title-error-helper">
                                                    {errors.charge_title}
                                                </FormHelperText>
                                            )
                                        }
                                    </Stack>
                                </Grid>
                                {errors.submit && (
                                    <Grid item xs={12}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                            Add
                                        </Button>
                                    </AnimateButton>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </Box>
        </Modal>
    )
}