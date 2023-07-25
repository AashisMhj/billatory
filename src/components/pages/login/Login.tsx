import { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';

// project import
import AnimateButton from '@/components/@extended/AnimateButton';
import { verifyUser } from '@/services/settings.service';
import { SnackBarContext } from '@/context/snackBar';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import paths from '@/routes/path';

const LoginForm = () => {

  const [show_password, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useContext(SnackBarContext);

  return (
    <>
      <Formik
        initialValues={{
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string().min(8, 'Password needs to min 8 characters').required(),
        })}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          setSubmitting(true);
          verifyUser(values.password)
            .then(data => {
              navigate(paths.dashboard);
              showAlert('Login Success', 'success')
            })
            .catch(err => {
              setErrors({ password: err })
              showAlert('' + err, 'error')
            })
            .finally(() => {
              setSubmitting(false)
            })
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password" required={true}>Password</InputLabel>
                  <OutlinedInput
                    autoFocus
                    id="password"
                    type={show_password ? "text" : "password"}
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
                          onClick={() => setShowPassword((pre_value) => !pre_value)}
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
                    Login
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

export default LoginForm;
