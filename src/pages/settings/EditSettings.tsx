import { useRef, useContext, useEffect } from "react";
import AnimateButton from "@/components/@extended/AnimateButton";
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import * as Yup from 'yup';
import { toDataURL } from "@/utils/helper-function";
import { FileAddOutlined } from "@ant-design/icons";
import { getSettings, updateSettings } from "@/services/settings.service";
import { SettingsContext } from "@/context/settings";
import { SnackBarContext } from "@/context/snackBar";

export default function EditSettingPage() {
    const fileRef = useRef<HTMLInputElement>(null);
    const { value, updateValue } = useContext(SettingsContext);
    const { showAlert } = useContext(SnackBarContext);
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75} >
            <Grid item xs={12}>
                <Typography variant='h4'>Edit Info</Typography>
            </Grid>
            <Grid item>
                <Formik
                    initialValues={{
                        ...value,
                        image: value.image,
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        organization_name: Yup.string().trim().required('Name is required').max(200),
                        location: Yup.string().trim().required('Address is required').max(200),
                        pan_no: Yup.number().required('Pan No is required').max(99999999999),
                        phone_no: Yup.string().trim().required('Phone No is required'),
                        image: Yup.mixed()
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            const data = await updateSettings({
                                organizationName: values.organization_name,
                                email: values.email,
                                image: values.image,
                                location: values.location,
                                panNo: values.pan_no,
                                phoneNo: values.phone_no
                            });
                            if (data === 200) {
                                const settings = await getSettings();
                                if (typeof settings === "string") {
                                    let setting_data = JSON.parse(settings);
                                    updateValue(setting_data);
                                    showAlert('Settings Updated', 'success');
                                }
                            }
                        } catch (err) {
                            console.log(err);
                            setStatus({ success: false });
                            if (err instanceof Error) {
                                setErrors({ submit: err.message });
                            }
                            setSubmitting(false);
                        } finally {
                            setStatus({ success: false });
                            setSubmitting(true);
                        }

                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="organization-name" required={true}>Organization Name</InputLabel>
                                        <OutlinedInput
                                            id="organization-name"
                                            type="text"
                                            value={values.organization_name}
                                            name="organization_name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="School Name"
                                            fullWidth
                                            error={Boolean(touched.organization_name && errors.organization_name)}
                                        />
                                        {touched.organization_name && errors.organization_name && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {errors.organization_name}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <img src={values.image} height={200} width={200} />
                                        <InputLabel htmlFor="organization-file" required={true}>Organization Logo</InputLabel>
                                        <input ref={fileRef} accept='image/*' style={{ display: 'none' }} type="file" onChange={async (event) => event?.target?.files && event?.target?.files.length > 0 ? setFieldValue('image', await toDataURL(event.target.files[0])) : undefined} />
                                        <Button variant='outlined' onClick={() => fileRef.current?.click()} startIcon={<FileAddOutlined />}>Select Another</Button>
                                        {touched.image && errors.image && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {errors.image}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="phone-no" >Email</InputLabel>
                                        <OutlinedInput
                                            id="phone-no"
                                            type="text"
                                            value={values.email}
                                            name="email"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Enter Email"
                                            fullWidth
                                            error={Boolean(touched.email && errors.email)}
                                        />
                                        {touched.email && errors.email && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {errors.email}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                {/* Phone no */}
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="phone-no" required={true}>Phone No</InputLabel>
                                        <OutlinedInput
                                            id="phone-no"
                                            type="string"
                                            value={values.phone_no}
                                            name="phone_no"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Enter Phone No"
                                            fullWidth
                                            error={Boolean(touched.phone_no && errors.phone_no)}
                                        />
                                        {touched.phone_no && errors.phone_no && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {errors.phone_no}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                {/* Pan No */}
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="pan-no" required={true}>Pan No</InputLabel>
                                        <OutlinedInput
                                            id="pan-no"
                                            type="number"
                                            value={values.pan_no}
                                            name="pan_no"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Enter Pan No"
                                            fullWidth
                                            error={Boolean(touched.pan_no && errors.pan_no)}
                                        />
                                        {touched.pan_no && errors.pan_no && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {errors.pan_no}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                {/* Phone No */}
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="address" required={true}>Address</InputLabel>
                                        <OutlinedInput
                                            id="address"
                                            type="text"
                                            value={values.location}
                                            name="location"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Your Address"
                                            fullWidth
                                            error={Boolean(touched.location && errors.location)}
                                        />
                                        {touched.location && errors.location && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {errors.location}
                                            </FormHelperText>
                                        )}
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
            </Grid>
        </Grid >
    )
}