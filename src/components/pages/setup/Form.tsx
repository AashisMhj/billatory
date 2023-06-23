import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileAddOutlined } from '@ant-design/icons'
// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from '@/components/@extended/AnimateButton';

const AuthLogin = () => {

  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  return (
    <>
      <Formik
        initialValues={{
          organization_name: 'The Company',
          image: '',
          address: 'Address',
          pan_no: 12345,
          phone_no: '98080',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          organization_name: Yup.string().trim().required('Name is required').max(200),
          address: Yup.string().trim().required('Address is required').max(200),
          pan_no: Yup.string().trim().required('Pan No is required').max(200),
          phone_no: Yup.string().trim().required('Phone No is required').max(200),
          image: Yup.mixed()
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          console.log(values);
          try {
            setStatus({ success: false });
            // TODO add settings here
            navigate('/dashboard');
            setSubmitting(false);
          } catch (err) {
            setStatus({ success: false });
            if (err instanceof Error) {
              setErrors({ submit: err.message });
            }
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="organization-name">Organization Name</InputLabel>
                  <OutlinedInput
                    id="organization-name"
                    type="text"
                    value={values.organization_name}
                    name="organization-name"
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
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              {/* <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="organization-file">Organization Logo</InputLabel>
                  <input ref={fileRef} accept='image/*' style={{display: 'none'}} type="file" onChange={(event) => event?.target?.files && event?.target?.files.length > 0 ?  setFieldValue('image', event.target.files[0]) : undefined } />
                  <Button variant='outlined' onClick={() => fileRef.current?.click()} startIcon={<FileAddOutlined />}>Upload</Button>
                  {touched.image && errors.image && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.image}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )} */}
              {/* Phone no */}
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="phone-no">Phone No</InputLabel>
                  <OutlinedInput
                    id="phone-no"
                    type="number"
                    value={values.phone_no}
                    name="phone-no"
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
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              {/* Pan No */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="pan-no">Pan No</InputLabel>
                  <OutlinedInput
                    id="pan-no"
                    type="text"
                    value={values.pan_no}
                    name="pan-no"
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
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              {/* Phone No */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="pan-no">Phone No</InputLabel>
                  <OutlinedInput
                    id="pan-no"
                    type="text"
                    value={values.pan_no}
                    name="pan-no"
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
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Done
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
