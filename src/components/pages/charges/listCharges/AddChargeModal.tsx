import { useState, useEffect } from "react";
import { Formik, } from "formik";
import * as Yup from 'yup';
import { Box, Button, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Modal, OutlinedInput, Select, Stack, SxProps, Typography } from "@mui/material";
import { CloseCircleOutlined } from '@ant-design/icons'
//
import { StudentClassType } from "@/types";
import AnimateButton from "@/components/@extended/AnimateButton";
import { addCharge } from "@/services/charge.service";
import { getClasses } from "@/services/class.service";



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
    borderRadius: '10px',
    p: 4
}
export default function EditModal({ open, handleClose, onSubmit }: Props) {
    const [classes, setClasses] = useState<Array<StudentClassType>>([]);

    useEffect(() => {
        getClasses(1, 100)
            .then(data => {
                if (typeof data === "string") {
                    const class_data = JSON.parse(data);
                    setClasses(class_data);
                }
            })
            .catch((error) => console.error(error));
    }, [])
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display="flex" alignItems="center" justifyContent="space-between" marginY={2}>
                    <Typography variant="h4" >Add Charge</Typography>
                    <IconButton onClick={handleClose} size="large" color="error">
                        <CloseCircleOutlined />
                    </IconButton>
                </Box>
                <Formik initialValues={{
                    charge_title: '',
                    amount: 0,
                    is_regular: false,
                    class: 0,
                    submit: null
                }}
                    validationSchema={Yup.object().shape({
                        charge_title: Yup.string().trim().required('This field is Required'),
                        amount: Yup.number().min(1, 'Please Enter the Amount').max(999999999, 'Charge Amount must be less then 9 digit').required('Please Enter the Amount'),
                        class: Yup.number().min(0, 'Please Select Class').required('Please Select Class'),
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        setStatus({ success: false });
                        setSubmitting(true);
                        addCharge(values.charge_title, values.amount, values.class)
                            .then(data => {
                                setSubmitting(false);
                                onSubmit();
                                handleClose()
                            })
                            .catch(err => {
                                setStatus(false);
                                console.error(err);
                                if (err instanceof Error) {
                                    setErrors({ submit: err.message });
                                }
                            })
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="charge">Charge</InputLabel>
                                        <OutlinedInput id="charge" type="text" value={values.charge_title} onBlur={handleBlur} onChange={handleChange} name='charge_title' fullWidth error={Boolean(errors.charge_title)} />
                                        {
                                            touched.charge_title && errors.charge_title && (
                                                <FormHelperText error id="charge_title-error-helper">
                                                    {errors.charge_title}
                                                </FormHelperText>
                                            )
                                        }
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="charge-amount">Amount</InputLabel>
                                        <OutlinedInput id="charge-amount" type="number" value={values.amount} onBlur={handleBlur} onChange={handleChange} name='amount' fullWidth error={Boolean(errors.amount && touched.amount)} />
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
                                        <InputLabel htmlFor="class" error={Boolean(errors.class && touched.class)}>Class</InputLabel>
                                        <Select labelId='class' value={values.class} name="class" onChange={handleChange} onBlur={handleBlur} error={Boolean(errors.class && touched.class)}>
                                            {
                                                classes.map((item) => <MenuItem key={item.id} value={item.id}>{item.class}</MenuItem>)
                                            }
                                        </Select>
                                        {
                                            touched.class && errors.class && (
                                                <FormHelperText error id="class-error-helper">
                                                    {errors.class}
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