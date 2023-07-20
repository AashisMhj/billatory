import { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileAddOutlined } from '@ant-design/icons'
import * as Yup from 'yup';
import { Formik } from 'formik';
// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';

// project import
import AnimateButton from '@/components/@extended/AnimateButton';
import { addSettings } from '@/services/settings.service';
import { toDataURL } from '@/utils/helper-function';
import { SnackBarContext } from '@/context/snackBar';
import { SettingsContext } from '@/context/settings';
import { SettingsType } from '@/types';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import paths from '@/routes/path';

const AuthLogin = () => {

  const fileRef = useRef<HTMLInputElement>(null);
  const [show_password, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useContext(SnackBarContext);
  const { updateValue } = useContext(SettingsContext);

  return (
    <>
      <Formik
        initialValues={{
          organization_name: '',
          image: null as File | null,
          location: '',
          pan_no: 0,
          phone_no: '',
          password: '',
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          organization_name: Yup.string().trim().required('Name is required').max(200),
          location: Yup.string().trim().required('Address is required').max(200),
          pan_no: Yup.number().required('Pan No is required').max(99999999999),
          phone_no: Yup.string().trim().required('Phone No is required'),
          image: Yup.mixed(),
          password: Yup.string().min(8,'Password needs to min 8 characters').required(),
          // passwordConfirmation: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')
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
              phoneNo: values.phone_no,
              password: values.password
            });
            if (data) {
              updateValue(data as SettingsType);
              showAlert('Settings Saved', 'success');
              navigate(paths.dashboard);
              setSubmitting(false);
            }
          } catch (err) {
            if (typeof err === "string") {
              showAlert(err, 'error');
            } else {
              showAlert('Error '+err, 'error');
              if (err instanceof Error) {
                setErrors({ submit: err.message });
              }

            }
            setStatus({ success: false });

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
                  <InputLabel htmlFor="organization-file" required={true}>Organization Logo</InputLabel>
                  <span>{values.image?.name || ''}</span>
                  <input ref={fileRef} accept='image/*' style={{ display: 'none' }} type="file" onChange={(event) => event?.target?.files && event?.target?.files.length > 0 ? setFieldValue('image', event.target.files[0]) : undefined} />
                  <Button variant='outlined' onClick={() => fileRef.current?.click()} startIcon={<FileAddOutlined />}>Upload</Button>
                  {touched.image && errors.image && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.image}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {/* email */}
              <Grid item xs={6}>
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
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="phone-no" required={true}>Phone No</InputLabel>
                  <OutlinedInput
                    id="phone-no"
                    type="text"
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

              {/* Phone No */}
              <Grid item xs={6}>
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
              {/* Pan No */}
              <Grid item xs={6}>
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
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password" required={true}>Password</InputLabel>
                  <OutlinedInput
                    id="password"
                    type={ show_password ? "text": "password"}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Password"
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((pre_value) => !pre_value )}
                        >
                          {show_password ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                      }
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password">
                      {errors.password}
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
