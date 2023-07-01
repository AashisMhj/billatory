import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileAddOutlined } from '@ant-design/icons'
import * as Yup from 'yup';
import { Formik } from 'formik';
// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material';


// project import
import AnimateButton from '@/components/@extended/AnimateButton';
import { addSettings } from '@/services/settings.service';
import { toDataURL } from '@/utils/helper-function';

const AuthLogin = () => {

  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  return (
    <>
      <Formik
        initialValues={{
          organization_name: 'The Company',
          image: null as File | null,
          location: 'Address',
          pan_no: 12345,
          phone_no: '98080',
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          organization_name: Yup.string().trim().required('Name is required').max(200),
          location: Yup.string().trim().required('Address is required').max(200),
          pan_no: Yup.number().required('Pan No is required').max(100000),
          phone_no: Yup.string().trim().required('Phone No is required').max(200),
          image: Yup.mixed()
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            
            const imageURL = await toDataURL(values.image);
            const data = await addSettings({
              organizationName: values.organization_name,
              email: values.email,
              image: imageURL as string,
              location: values.location,
              panNo: values.pan_no,
              phoneNo: values.phone_no
            });
            if(data === 200){

              navigate('/dashboard');
              setSubmitting(false);
            }
            } catch (err) {
              setStatus({ success: false });
              if (err instanceof Error) {
                setErrors({ submit: err.message });
              }
              
            }finally{
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
                  <InputLabel htmlFor="organization-name">Organization Name</InputLabel>
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
                  <InputLabel htmlFor="organization-file">Organization Logo</InputLabel>
                  <input ref={fileRef} accept='image/*' style={{ display: 'none' }} type="file" onChange={(event) => event?.target?.files && event?.target?.files.length > 0 ? setFieldValue('image', event.target.files[0]) : undefined} />
                  <Button variant='outlined' onClick={() => fileRef.current?.click()} startIcon={<FileAddOutlined />}>Upload</Button>
                  {touched.image && errors.image && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.image}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              {/* Phone no */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="phone-no">Phone No</InputLabel>
                  <OutlinedInput
                    id="phone-no"
                    type="number"
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
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              {/* Phone No */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="address">Address</InputLabel>
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
