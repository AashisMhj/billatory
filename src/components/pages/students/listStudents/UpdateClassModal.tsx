import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from 'yup';
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { Box, Button, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, Stack, SxProps, Typography } from "@mui/material";
//
import AnimateButton from "@/components/@extended/AnimateButton";
import { StudentsTableFilterType, StudentClassType } from "@/types";
import { getClasses } from "@/services/class.service";
import { bulkUpdateStudentClass } from "@/services/student.service";


interface Props {
    open: boolean,
    handleClose: () => void,
    onSubmit: () => void,
    student_ids: Array<number>
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


export default function UpdateStudentClassModal({ open, handleClose, onSubmit, student_ids }: Props) {

    const [classes, setClasses] = useState<Array<StudentClassType>>([]);

    useEffect(() => {
        getClasses(1, 10000)
            .then((data) => {
                if (typeof data === "string") {
                    const class_data = JSON.parse(data);
                    setClasses(class_data);
                }
            })
            .catch(error => console.log(error))
    }, []);

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant="h5" >Update Student Class Data</Typography>
                    <IconButton onClick={() => handleClose()} size="large">
                        <CloseCircleOutlined />
                    </IconButton>
                </Box>
                <Formik initialValues={{ class_id: 0, submit: null }}
                    validationSchema={Yup.object().shape({
                        class_id: Yup.number().min(1, 'Please Select the class').required('Please Select the class'),
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        setStatus({ success: false });
                        bulkUpdateStudentClass(values.class_id, student_ids)
                            .then(data => {
                                setStatus({ success: true });
                                onSubmit();
                                handleClose();
                            })
                            .catch(err => {
                                console.error(err);
                                setStatus(false);
                                if (err instanceof Error) {
                                    setErrors({ submit: err.message });
                                }
                            }).finally(()=>{
                                setSubmitting(false);
                                handleClose();
                            })

                    }}
                >
                    {({ errors, handleChange, handleSubmit, isSubmitting, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="class" error={Boolean(errors.class_id)}>Class</InputLabel>
                                        <Select labelId="class" id="class" value={values.class_id} name='class_id' onChange={handleChange}>
                                            {
                                                classes.map((cl) => <MenuItem value={cl.id}>{cl.class}</MenuItem>)
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