import { Formik } from "formik";
import * as Yup from 'yup';
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { Box, Button, FormHelperText, Grid, IconButton, InputLabel, Modal, OutlinedInput, Stack, SxProps, Typography } from "@mui/material";
//
import { ChargesType } from "@/types";
import AnimateButton from "@/components/@extended/AnimateButton";
import { updateCharge } from "@/services/charge.service";

interface Props {
    open: boolean,
    handleClose: () => void,
    onSubmit: () => void,
    data: ChargesType | null
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
export default function EditChargeModal({ open, handleClose, onSubmit, data }: Props) {
    return (
        <Modal
            open={open && data !== null}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant="h5" >Edit Charge</Typography>
                    <IconButton onClick={() => handleClose()}>
                        <CloseCircleOutlined />
                    </IconButton>
                </Box>
                <Formik initialValues={{ ...data, submit: null }}
                    validationSchema={Yup.object().shape({
                        class: Yup.string().trim().required('Class Title is Required')
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        console.log('submitting');
                        console.log(values);
                        setStatus({ success: false });
                        if (values && values.id && values.amount && values.charge_title) {
                            updateCharge({ amount: values.amount, id: values.id, charge_title: values.charge_title })
                                .then((data) => {
                                    console.log(data);
                                    if (data === 200) {
                                        setSubmitting(false);
                                        handleClose();
                                        onSubmit()
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    setStatus(false);
                                    if (err instanceof Error) {
                                        setErrors({ submit: err.message });
                                    }
                                })
                        }
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="charge-title">Title</InputLabel>
                                        <OutlinedInput id="charge-title" type="text" value={values.charge_title} onBlur={handleBlur} onChange={handleChange} name='charge_title' fullWidth error={Boolean(errors.charge_title)} />
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
                                        <InputLabel htmlFor="amount">Amount</InputLabel>
                                        <OutlinedInput id="amount" type="number" value={values.amount} onBlur={handleBlur} onChange={handleChange} name='amount' fullWidth error={Boolean(errors.amount)} />
                                        {
                                            touched.amount && errors.amount && (
                                                <FormHelperText error id="amount-error-helper">
                                                    {errors.amount}
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
                                            Update
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