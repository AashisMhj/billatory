import { useState, useEffect, useContext } from "react";
import { Formik, FormikErrors } from "formik";
import * as Yup from 'yup';
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { Box, Button, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Modal, OutlinedInput, Select, SelectChangeEvent, Stack, SxProps, Typography } from "@mui/material";
//
import AnimateButton from "@/components/@extended/AnimateButton";
import { ChargesType } from "@/types";
import { applyCharge, getCharges } from "@/services/charge.service";
import { Months } from "@/utils/constants";
import NepaliDate from "nepali-date-converter";
import { SnackBarContext } from "@/context/snackBar";

type ListChargeTpe = {
    display: boolean
} & ChargesType;


interface Props {
    open: boolean,
    handleClose: () => void,
    onSubmit: () => void,
    student_ids: Array<number>,
    filtered_class: number | null
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


export default function UpdateStudentClassModal({ open, handleClose, onSubmit, student_ids, filtered_class }: Props) {

    const [charges, setCharges] = useState<Array<ListChargeTpe>>([]);
    const nepali_date = new NepaliDate(Date.now());
    const { showAlert } = useContext(SnackBarContext);

    function handleChargeChange(event: SelectChangeEvent<number>, setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{ amount: number; charge_title: string; student_id: number; charge_id: number; submit: null; }>>) {
        const parsed_id = event.target.value
        const charge_index = charges.findIndex(el => el.id === parsed_id);
        if (charge_index !== -1) {
            setFieldValue('charge_id', parsed_id);
            setFieldValue('charge_title', charges[charge_index].charge_title);
            setFieldValue('amount', charges[charge_index].amount)
        }
    }

    useEffect(() =>{
        console.log(filtered_class);
        if(filtered_class){
            setCharges(charges.map(el => {
                console.log(el.class_id)
                return {
                    ...el,
                    display: el.class_id === filtered_class
                }
            }));
        }else{
            setCharges(charges.map(el => ({...el, display: true})))
        }
    }, [filtered_class])

    useEffect(() => {
        getCharges(1, 999999)
            .then(data => {
                if (typeof data === "string") {
                    const charges_data = JSON.parse(data) as Array<ChargesType>;
                    setCharges(charges_data.map((el) => ({...el, display: true})))
                }
            })
            .catch(error => console.log(error))
    }, []);

    console.log(charges)
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant="h5" >Apply Charges</Typography>
                    <IconButton onClick={() => handleClose()} size="large" color="error">
                        <CloseCircleOutlined />
                    </IconButton>
                </Box>
                <Formik initialValues={{ amount: 0, charge_title: '', student_id: 0, charge_id: 0, nepali_month: nepali_date.getMonth() + 1, nepali_year: nepali_date.getYear(), submit: null }}
                    validationSchema={Yup.object().shape({
                        amount: Yup.number().min(1, "Amount is Required").required("Amount is Required"),
                        charge_title: Yup.string().trim().required("Charge Title is Required"),
                        charge_id: Yup.number().min(1, "Please Select a Charge").required("Please Select a Charge"),
                        nepali_year: Yup.number().required('Year is Required'),
                        nepali_month: Yup.number().required('Month is Required')
                    })}
                    onSubmit={async (values, {  setStatus, setSubmitting }) => {
                        setStatus({ success: false });
                        setSubmitting(true);
                        applyCharge(values.charge_id, student_ids, values.amount, values.charge_title, values.nepali_month, values.nepali_year)
                            .then(_ => {
                                showAlert('Charges applied', 'success');
                                onSubmit();
                                handleClose();
                            })
                            .catch(error => {
                                console.log(error);
                                showAlert('Failed to Apply Charge' + error, 'error');
                            })

                    }}
                >
                    {({ errors, handleChange, handleSubmit, isSubmitting, values, setFieldValue, touched }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="charge_id" error={Boolean(errors.charge_id && touched.charge_id )}>Charge</InputLabel>
                                        <Select labelId="charge_id" id="charge_id" value={values.charge_id} name='charge_id' onChange={(event) => handleChargeChange(event, setFieldValue)}>
                                            {
                                                charges.filter(el=> el.display).map((ch) => <MenuItem value={ch.id}>{ch.charge_title} - {ch.class || ''} </MenuItem>)
                                            }
                                        </Select>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="amount" required={true}>Amount</InputLabel>
                                        <OutlinedInput
                                            id="amount"
                                            type="number"
                                            value={values.amount}
                                            name="amount"
                                            onChange={handleChange}
                                            placeholder="amount"
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="amount" required={true} error={Boolean(errors.charge_title && touched.charge_title )}>Charge Title</InputLabel>
                                        <OutlinedInput
                                            id="charge-title"
                                            type="text"
                                            value={values.charge_title}
                                            name="charge_title"
                                            onChange={handleChange}
                                            placeholder="amount"
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="year" required={true} error={Boolean(errors.nepali_year && touched.nepali_year )}>Year</InputLabel>
                                        <OutlinedInput
                                            id="year"
                                            type="number"
                                            value={values.nepali_year}
                                            name="selected_year"
                                            onChange={handleChange}
                                            placeholder="Current Year"
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="month" required={true}>Month</InputLabel>
                                        <Select labelId="month" value={values.nepali_month} name="nepali_month" onChange={handleChange}>
                                            {
                                                Months.map((item) => <MenuItem key={item.value} value={item.value}>{item.month_name}</MenuItem>)
                                            }
                                        </Select>
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
                                            Apply
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