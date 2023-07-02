import { useState, useEffect } from "react";
import { Formik, } from "formik";
import * as Yup from 'yup';
import { Box, Button, Checkbox, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, InputLabel, Modal, OutlinedInput, Radio, RadioGroup, Stack, SxProps, Typography } from "@mui/material";
import {CloseCircleOutlined} from '@ant-design/icons'
//
import { ChargesType, StudentClassType } from "@/types";
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
    border: '2px solid #000',
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
            .catch((error) => console.log(error));
    }, [])
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display="flex" alignItems="center" justifyContent="space-between" marginY={2}>
                    <Typography variant="h4" >Add Charge</Typography>
                    <IconButton onClick={handleClose} >
                        <CloseCircleOutlined />
                    </IconButton>
                </Box>
                <Formik initialValues={{
                    charge_title: '',
                    amount: 0,
                    is_regular: false,
                    class: [] as number[],
                    submit: null
                }}
                    validationSchema={Yup.object().shape({
                        charge_title: Yup.string().trim().required('This field is Required'),
                        amount: Yup.number().min(0).required(),
                        is_regular: Yup.boolean().required()
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        console.log(values);
                        setStatus({ success: false });
                        setSubmitting(true);
                        addCharge(values.charge_title, values.amount, values.class, values.is_regular)
                            .then(data => {
                                setSubmitting(false);
                                console.log(data);
                                onSubmit();
                                handleClose()
                            })
                            .catch(err => {
                                setStatus(false);
                                console.log(err);
                                if (err instanceof Error) {
                                    setErrors({ submit: err.message });
                                }
                            })
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
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
                                        <OutlinedInput id="charge-amount" type="number" value={values.amount} onBlur={handleBlur} onChange={handleChange} name='amount' fullWidth error={Boolean(errors.amount)} />
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
                                    <Typography variant="h6" color='gray' >Classes</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={3}>
                                        {
                                            classes.map((class_item) => (
                                                <Grid item xs={6}>
                                                    <FormControlLabel label={class_item.class} control={
                                                        <Checkbox value={class_item.id} checked={values.class.includes(class_item.id)} onChange={(event) => {
                                                            if (values.class.includes(class_item.id)) {
                                                                let current_values = values.class;
                                                                const value_index = values.class.indexOf(parseInt(event.target.value));
                                                                if (value_index > -1) {
                                                                    current_values.splice(value_index, 1);
                                                                }
                                                                setFieldValue('class', current_values);
                                                            } else {
                                                                const current_values = values.class;
                                                                setFieldValue('class', [...current_values, class_item.id])
                                                            }
                                                        }} />
                                                    } />
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                </Grid>
                               
                                <Grid item xs={12}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <FormLabel id="radio-buttons-charge-type">Charge Type</FormLabel>                                            
                                            <RadioGroup row={true} onChange={(event) => setFieldValue("is_regular",event.target.value === "true")} defaultValue={true} name="is_regular" value={values.is_regular}>
                                                <FormControlLabel value={true} control={<Radio />} label="Regular" />
                                                <FormControlLabel value={false} control={<Radio />} label="Not Regular" />
                                            </RadioGroup>
                                        </Grid>
                                    </Grid>
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