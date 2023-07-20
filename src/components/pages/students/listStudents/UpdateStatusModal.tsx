import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from 'yup';
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { Box, Button,  FormHelperText, Grid, IconButton,  Modal, SxProps, Typography } from "@mui/material";
//
import AnimateButton from "@/components/@extended/AnimateButton";

import { bulkUpdateStudentStatus } from "@/services/student.service";


interface Props {
    open: boolean,
    handleClose: () => void,
    new_status: boolean,
    student_ids: Array<number>,
    onSubmit: () => void
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


export default function UpdateStudentClassModal({ open, handleClose, onSubmit, new_status, student_ids }: Props) {

    
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant="h5" >Update Student Status </Typography>
                    <IconButton onClick={() => handleClose()} size="large">
                        <CloseCircleOutlined />
                    </IconButton>
                </Box>
                <Formik initialValues={{ class_id: 0, submit: null }}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        setStatus({ success: false });
                        bulkUpdateStudentStatus(new_status, student_ids)
                            .then(data => {
                                setStatus({ success: true });
                                onSubmit();
                                handleClose();
                            })
                            .catch(err => {
                                setStatus(false);
                                if (err instanceof Error) {
                                    setErrors({ submit: err.message });
                                }
                            })
                        setSubmitting(false);
                        handleClose();

                    }}
                >
                    {({ errors, handleSubmit, isSubmitting, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="h4"> {new_status ? "Enable" : "Disable"} Status of {student_ids.length} students ?</Typography>
                                </Grid>
                                {errors.submit && (
                                    <Grid item xs={12}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                            YES
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