import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from 'yup';
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { Box, Button, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select, Stack, SxProps, Typography } from "@mui/material";
//
import { Months } from "@/utils/constants";
import AnimateButton from "@/components/@extended/AnimateButton";
import { FeesFilterType, StudentClassType, StudentMiniType } from "@/types";
import { getClasses } from "@/services/class.service";
import { getAllActiveStudents } from "@/services/student.service";



interface Props {
    open: boolean,
    handleClose: () => void,
    onSubmit: (value: FeesFilterType) => void,
    value: FeesFilterType,
    clearFilter: () => void
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

const DropDownItems = [10, 20, 30];

export default function FeesFilterModal({ open, handleClose, onSubmit, value, clearFilter }: Props) {

    const [classes, setClasses] = useState<Array<StudentClassType>>([]);
    const [all_students, setAllStudents] = useState<Array<StudentMiniType>>([])

    useEffect(() => {
        getClasses(1, 10000)
            .then((data) => {
                if (typeof data === "string") {
                    const class_data = JSON.parse(data);
                    setClasses(class_data);
                }
            })
            .catch(error => console.error(error));

        getAllActiveStudents()
            .then(data => {
                if (typeof data === "object") {
                    setAllStudents(data as Array<StudentMiniType>)
                }
            })
            .catch(error => console.error(error))
    }, [])
    return (
        <Modal
            open={open && value !== null}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant="h5" >Filter Data</Typography>
                    <IconButton onClick={() => handleClose()} size="large">
                        <CloseCircleOutlined />
                    </IconButton>
                </Box>
                <Formik initialValues={{ ...value, submit: null }}
                    validationSchema={Yup.object().shape({
                        limit: Yup.string().trim().required('Limit is Required'),
                        class_id: Yup.number(),
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            setStatus({ success: false });
                            setSubmitting(false);
                            onSubmit({ limit: values.limit, class_id: values.class_id, charge: values.charge, student_id: values.student_id, year: values.year, month: values.month });
                            handleClose();
                        } catch (error) {
                            setStatus(false);
                            if (error instanceof Error) {
                                setErrors({ submit: error.message });
                            }
                        }
                    }}
                >
                    {({ errors, handleChange, handleSubmit, isSubmitting, values, touched, handleBlur }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="limit">Limit</InputLabel>
                                        <Select labelId="limit" id='limit' value={values.limit} name="limit" onChange={handleChange}>
                                            {
                                                DropDownItems.map((item) => <MenuItem value={item}>{item}</MenuItem>)
                                            }
                                        </Select>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="class">Class</InputLabel>
                                        <Select labelId="class" id="class" value={values.class_id} name='class_id' onChange={handleChange}>
                                            {
                                                classes.map((cl) => <MenuItem value={cl.id}>{cl.class}</MenuItem>)
                                            }
                                        </Select>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="student_id">Students</InputLabel>
                                        <Select labelId="student_id" id="student_id" value={values.student_id} name='student_id' onChange={handleChange} error={Boolean(errors.student_id && touched.student_id)}>
                                            {
                                                all_students.map((st) => <MenuItem value={st.id}>{`${st.first_name} ${st.last_name}`}</MenuItem>)
                                            }
                                        </Select>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="year" >Year</InputLabel>
                                        <OutlinedInput id="year" type="number" value={values.year} onBlur={handleBlur} onChange={handleChange} name='year' fullWidth error={Boolean(touched.year && errors.year)} />
                                        {
                                            touched.year && errors.year && (
                                                <FormHelperText error id="year-error-helper">
                                                    {errors.year}
                                                </FormHelperText>
                                            )
                                        }
                                    </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack spacing={1}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="month">Month</InputLabel>
                                            <Select labelId="month" id="month" value={values.month} name='month' onChange={handleChange}>
                                                {
                                                    Months.map((mo) => <MenuItem value={mo.value}>{mo.month_name}</MenuItem>)
                                                }
                                            </Select>
                                        </Stack>
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
                                <Grid item xs={12}>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting} fullWidth size="large" variant="outlined" color="secondary" onClick={clearFilter}>
                                            Clear Filter
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