import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from 'yup';
import { Box, Button, FormHelperText, Grid, InputLabel, Modal, OutlinedInput, Stack, SxProps, Typography } from "@mui/material";
import { ClassType } from "@/types";
import AnimateButton from "@/components/@extended/AnimateButton";
import {addClass} from '@/services/class.service'


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
    bgcolor: 'Background',
    border: '2px solid #000',
    p: 4
}
export default function EditModal({ open, handleClose, onSubmit }: Props) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Typography variant="h6" >Add Class</Typography>
                <Formik initialValues={{ class: '', submit: null }}
                    validationSchema={Yup.object().shape({
                        class: Yup.string().trim().required('Class Title is Required')
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            setStatus({ success: false });
                            addClass({
                                class: values.class,
                            }).then((data)=>{
                                setSubmitting(false);
                                onSubmit();
                                handleClose();
                            })
                            .catch((err) =>{
                                console.log(err);
                            })
                        } catch (error) {
                            setStatus(false);
                            if (error instanceof Error) {
                                setErrors({ submit: error.message });
                            }
                        }
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="class-name">Class</InputLabel>
                                        <OutlinedInput id="class-name" type="text" value={values.class} onBlur={handleBlur} onChange={handleChange} name='class' fullWidth error={Boolean(touched.class)} />
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