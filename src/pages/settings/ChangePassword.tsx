import { useContext } from 'react';
import MainCard from '@/components/layouts/MainCard';
import { PageTitle } from '@/components/shared';
import { Button, Container, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from '@/components/@extended/AnimateButton';
import { changePassword } from '@/services/settings.service';
import { SnackBarContext } from '@/context/snackBar';


export default function ChangePassword() {
    const {showAlert} = useContext(SnackBarContext);
    return (
        <Box>
            <PageTitle title='Change Password' />
            <Container>
                <MainCard boxShadow>
                    <Formik initialValues={{ current_password: '', new_password: '', confirm_password: '' }}
                        validationSchema={Yup.object().shape({
                            current_password: Yup.string().min(8, 'Password must be atleast 8 characters').required(),
                            new_password: Yup.string().min(8, 'Password must be atleast 8 characters').required(),
                            passwordConfirmation: Yup.string().oneOf([Yup.ref('new_password')], 'Passwords must match')

                        })}
                        onSubmit={(values, {setSubmitting }) => {
                            setSubmitting(true);
                            changePassword(values.current_password, values.new_password)
                                .then((data) => {
                                    showAlert('Password Updated', 'success');
                                })
                                .catch(err => showAlert(''+err, 'error'))
                                .finally(() =>{
                                    setSubmitting(false)
                                })
                            
                        }}
                    >
                        {
                            ({ values, errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
                                <form noValidate onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="old-password" required={true}>Current Password</InputLabel>
                                                <OutlinedInput
                                                    id="old-password"
                                                    type="password"
                                                    value={values.current_password}
                                                    name="current_password"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Current Password"
                                                    fullWidth
                                                    error={Boolean(touched.current_password && errors.current_password)}
                                                />
                                                {touched.current_password && errors.current_password && (
                                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                                        {errors.current_password}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="new-password" required={true}>New Password</InputLabel>
                                                <OutlinedInput
                                                    id="new-password"
                                                    type="password"
                                                    value={values.new_password}
                                                    name="new_password"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="New Password"
                                                    fullWidth
                                                    error={Boolean(touched.new_password && errors.new_password)}
                                                />
                                                {touched.new_password && errors.new_password && (
                                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                                        {errors.new_password}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="confirm-password" required={true}>Confirm Password</InputLabel>
                                                <OutlinedInput
                                                    id="confirm-password"
                                                    type="password"
                                                    value={values.confirm_password}
                                                    name="confirm_password"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Confirm Password"
                                                    fullWidth
                                                    error={Boolean(touched.confirm_password && errors.confirm_password)}
                                                />
                                                {touched.confirm_password && errors.confirm_password && (
                                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                                        {errors.confirm_password}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <AnimateButton>
                                                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                                    Update
                                                </Button>
                                            </AnimateButton>
                                        </Grid>
                                    </Grid>
                                </form>
                            )
                        }

                    </Formik>
                </MainCard>
            </Container>
        </Box>
    )
}