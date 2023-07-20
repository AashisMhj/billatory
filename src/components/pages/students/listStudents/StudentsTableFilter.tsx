import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from 'yup';
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { Box, Button, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, Stack, SxProps, Typography } from "@mui/material";
//
import AnimateButton from "@/components/@extended/AnimateButton";
import { StudentsTableFilterType, StudentClassType } from "@/types";
import { getClasses } from "@/services/class.service";
import { DropdownLimitValues } from "@/utils/constants";

enum ActiveOptions {
    yes = "YES",
    no = "NO"
}

interface Props {
    open: boolean,
    handleClose: () => void,
    onSubmit: (value: StudentsTableFilterType) => void,
    value: StudentsTableFilterType
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


export default function StudentsTableFilter({ open, handleClose, onSubmit, value }: Props) {

    const [classes, setClasses] = useState<Array<StudentClassType>>([]);

    function resetFilter(){
        onSubmit({ limit: 10, show_active:  true })
    }

    useEffect(() => {
        getClasses(1, 10000)
            .then((data) => {
                if (typeof data === "string") {
                    const class_data = JSON.parse(data);
                    setClasses(class_data);
                }
            })
            .catch(error => console.log(error))
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
                <Formik initialValues={{ ...value, show_active: value.show_active ? ActiveOptions.yes : ActiveOptions.no, submit: null }}
                    validationSchema={Yup.object().shape({
                        limit: Yup.string().trim().required('Limit is Required'),
                        class: Yup.number(),
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            setStatus({ success: false });
                            setSubmitting(false);
                            onSubmit({ limit: values.limit, class: values.class, show_active: values.show_active === ActiveOptions.yes });
                            handleClose();
                        } catch (error) {
                            setStatus(false);
                            if (error instanceof Error) {
                                setErrors({ submit: error.message });
                            }
                        }
                    }}
                >
                    {({ errors, handleChange, handleSubmit, isSubmitting, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="limit">Limit</InputLabel>
                                        <Select labelId="limit" id='limit' value={values.limit} name="limit" onChange={handleChange}>
                                            {
                                                DropdownLimitValues.map((item) => <MenuItem value={item}>{item}</MenuItem>)
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
                                <Grid item xs={12}>
                                    <FormControl>
                                        <FormLabel id="student-status-radio-group-label">Active?</FormLabel>
                                        <RadioGroup row={true} defaultValue={false} value={values.show_active} onChange={handleChange} name="show_active">
                                            <FormControlLabel value={ActiveOptions.yes} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={ActiveOptions.no} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                {errors.submit && (
                                    <Grid item xs={12}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting} fullWidth size="large"  variant="outlined" color="secondary">
                                            Reset Filter
                                        </Button>
                                    </AnimateButton>
                                </Grid>
                                <Grid item xs={12}>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                            Filter
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