import { Formik } from "formik";
import * as Yup from 'yup';
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { Box, Button, FormHelperText, Grid, IconButton, InputLabel, Modal, OutlinedInput, Stack, SxProps, Typography } from "@mui/material";
//
import { StudentClassType } from "@/types";
import AnimateButton from "@/components/@extended/AnimateButton";
import { updateClass } from "@/services/class.service";

interface Props {
    open: boolean,
    handleClose: () => void,
    onSubmit: () => void,
    data: StudentClassType | null
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
export default function EditModal({ open, handleClose, onSubmit, data }: Props) {
    return (
        <Modal
            open={open && data !== null}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant="h5" >Edit Class</Typography>
                    <IconButton onClick={() => handleClose()} size="large">
                        <CloseCircleOutlined />
                    </IconButton>
                </Box>
                <Formik initialValues={{ ...data, submit: null }}
                    validationSchema={Yup.object().shape({
                        class: Yup.string().trim().required('Class Title is Required')
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                        setStatus({ success: false });
                        if (data && data.id && values.class) {
                            updateClass({ class: values.class, id: data.id })
                                .then((data) => {
                                    if (data === 200) {
                                        setSubmitting(false);
                                        handleClose();
                                        onSubmit()
                                    }
                                })
                                .catch(err => {
                                    setStatus(false);
                                    if (err instanceof Error) {
                                        setErrors({ submit: err.message });
                                    }
                                })
                        }
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="class-name">Class</InputLabel>
                                        <OutlinedInput id="class-name" type="text" value={values.class} onBlur={handleBlur} onChange={handleChange} name='class' fullWidth error={Boolean(touched.class)} />
                                        {
                                            touched.class && errors.class && (
                                                <FormHelperText error id="class-error-helper">
                                                    {errors.class}
                                                </FormHelperText>
                                            )
                                        }
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