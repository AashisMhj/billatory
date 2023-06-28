import {useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from 'yup';
import { Box, Button, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, Stack, SxProps, Typography } from "@mui/material";
import AnimateButton from "@/components/@extended/AnimateButton";
import { StudentsTableFilterType, ClassType } from "@/types";

interface Props {
    open: boolean,
    handleClose: () => void,
    onSubmit: (value:StudentsTableFilterType) => void,
    value: StudentsTableFilterType
}
const style: SxProps = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'Background',
    border: '2px solid #000',
    p: 4
}

const DropDownItems = [10, 20, 30];

export default function EditModal({ open, handleClose, onSubmit, value }: Props) {

    const [classes, setClasses] = useState<Array<ClassType>>([]);
    useEffect(()=>{
        // TODO fetch classes
    }, [])
    return (
        <Modal
            open={open && value !== null}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Typography variant="h6" >Filter Data</Typography>
                <Formik initialValues={{ ...value, submit: null }}
                    validationSchema={Yup.object().shape({
                        limit: Yup.string().trim().required('Limit is Required'),
                        class: Yup.number(),
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            setStatus({ success: false });
                            // TODO update 
                            setSubmitting(false);
                            onSubmit({limit: values.limit});
                            handleClose();
                        } catch (error) {
                            setStatus(false);
                            if (error instanceof Error) {
                                setErrors({ submit: error.message });
                            }
                        }
                    }}
                >
                    {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
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
                                        <Select labelId="class" id="class" value={values.class} name='class' onChange={handleChange}>
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