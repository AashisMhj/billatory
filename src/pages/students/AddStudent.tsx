import { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, Stack, Typography } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ClassType, GenderType } from '@/types';
import AnimateButton from '@/components/@extended/AnimateButton';
import { getClasses } from '@/services/class.service';
import { addStudent } from '@/services/student.service';

export default function AddStudentPage() {
    const [classes, setClasses] = useState<Array<ClassType>>([]);
    useEffect(() => {
        getClasses(1, 100)
            .then((data) => {
                if (typeof data === "string") {
                    const class_data = JSON.parse(data);
                    console.log(class_data)
                    setClasses(class_data);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    return (
        <Box>
            <Typography variant='h4'>Add Student Record</Typography>
            <Formik
                initialValues={{
                    first_name: '',
                    last_name: '',
                    mid_name: '',
                    class_id: 0,
                    gender: '',
                    address: '',
                    father_name: '',
                    mother_name: '',
                    date_of_birth: '',
                    phone_no: '',
                    email: '',
                    guardian_name: '',
                    guardian_relation: '',
                    emergency_contact: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    first_name: Yup.string().trim().required('First Name is Required'),
                    last_name: Yup.string().trim().required('Last Name is Required'),
                    mid_name: Yup.string().trim(),
                    class_id: Yup.number().required(),
                    gender: Yup.string().required('Gender is Required').oneOf(['male', 'female']),
                    address: Yup.string().trim().required('First Name is Required'),
                    father_name: Yup.string().trim().required('Father Name is Required'),
                    mother_name: Yup.string().trim().required('Mother Name is Required'),
                    date_of_birth: Yup.date(),
                    phone_no: Yup.string().trim(),
                    email: Yup.string(),
                    guardian_name: Yup.string().trim(),
                    guardian_relation: Yup.string().trim(),
                    emergency_contact: Yup.string().trim()
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    setStatus({ success: false });
                    setSubmitting(true);
                    addStudent({
                        first_name: values.first_name,
                        last_name: values.last_name,
                        mid_name: values.mid_name,
                        class_id: values.class_id,
                        gender: values.gender as GenderType,
                        address: values.address,
                        father_name: values.father_name,
                        mother_name: values.mother_name,
                        date_of_birth: values.date_of_birth,
                        phone_no: values.phone_no,
                        email: values.email,
                        guardian_name: values.guardian_name,
                        guardian_relation: values.guardian_relation,
                        emergency_contact: values.emergency_contact
                    }
                    )
                        .then((data) => {
                            console.log(data);
                            // TODO navigate
                        })
                        .catch((error) => {
                            console.log(error);
                            setStatus(false);
                            if (error instanceof Error) {
                                setErrors({ submit: error.message });
                            }
                        })
                        .finally(()=>{
                            setSubmitting(false);
                        })
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Grid container spacing={12}>
                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="first-name">First Name</InputLabel>
                                            <OutlinedInput id="first-name" type="text" value={values.first_name} onBlur={handleBlur} onChange={handleChange} name='first_name' fullWidth error={Boolean(touched.first_name)} />
                                            {
                                                touched.first_name && errors.first_name && (
                                                    <FormHelperText error id="class-error-helper">
                                                        {errors.first_name}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="middle-name">Middle Name</InputLabel>
                                            <OutlinedInput id="middle-name" type="text" value={values.mid_name} onBlur={handleBlur} onChange={handleChange} name='mid_name' fullWidth error={Boolean(touched.mid_name)} />
                                            {
                                                touched.mid_name && errors.mid_name && (
                                                    <FormHelperText error id="class-error-helper">
                                                        {errors.mid_name}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="last-name">Last Name</InputLabel>
                                            <OutlinedInput id="last-name" type="text" value={values.last_name} onBlur={handleBlur} onChange={handleChange} name='last_name' fullWidth error={Boolean(touched.last_name)} />
                                            {
                                                touched.last_name && errors.last_name && (
                                                    <FormHelperText error id="class-error-helper">
                                                        {errors.last_name}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="father-name">Father Name</InputLabel>
                                            <OutlinedInput id="father-name" type="text" value={values.father_name} onBlur={handleBlur} onChange={handleChange} name='father_name' fullWidth error={Boolean(touched.father_name)} />
                                            {
                                                touched.father_name && errors.father_name && (
                                                    <FormHelperText error id="class-error-helper">
                                                        {errors.father_name}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="mother-name">Mother Name</InputLabel>
                                            <OutlinedInput id="mother-name" type="text" value={values.mother_name} onBlur={handleBlur} onChange={handleChange} name='mother_name' fullWidth error={Boolean(touched.mother_name)} />
                                            {
                                                touched.mother_name && errors.mother_name && (
                                                    <FormHelperText error id="class-error-helper">
                                                        {errors.mother_name}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={3}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="address">Address</InputLabel>
                                            <OutlinedInput id="address" type="text" value={values.address} onBlur={handleBlur} onChange={handleChange} name='address' fullWidth error={Boolean(touched.address)} />
                                            {
                                                touched.address && errors.address && (
                                                    <FormHelperText error id="class-error-helper">
                                                        {errors.address}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="email">Email</InputLabel>
                                            <OutlinedInput id="email" type="text" value={values.email} onBlur={handleBlur} onChange={handleChange} name='email' fullWidth error={Boolean(touched.email)} />
                                            {
                                                touched.email && errors.email && (
                                                    <FormHelperText error id="class-error-helper">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="dob">Date of Birth</InputLabel>
                                            <OutlinedInput id="dob" type="date" value={values.date_of_birth} onBlur={handleBlur} onChange={handleChange} name='date_of_birth' fullWidth error={Boolean(touched.date_of_birth)} />
                                            {
                                                touched.date_of_birth && errors.date_of_birth && (
                                                    <FormHelperText error id="class-error-helper">
                                                        {errors.date_of_birth}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="phone-no">Phone No</InputLabel>
                                            <OutlinedInput id="phone-no" type="text" value={values.phone_no} onBlur={handleBlur} onChange={handleChange} name='phone_no' fullWidth error={Boolean(touched.phone_no)} />
                                            {
                                                touched.phone_no && errors.phone_no && (
                                                    <FormHelperText error id="class-error-helper">
                                                        {errors.phone_no}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="class">Class</InputLabel>
                                    <Select labelId="class" id='class' value={values.class_id} name="class_id" onChange={handleChange}>
                                        {
                                            classes.map((item) => <MenuItem key={item.id} value={item.id}>{item.class}</MenuItem>)
                                        }
                                    </Select>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                                    <RadioGroup
                                        row={true}
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="gender"
                                        value={values.gender}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    </RadioGroup>
                                </FormControl>
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
                )}

            </Formik>
        </Box>
    )
}