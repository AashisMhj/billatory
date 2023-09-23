import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack,} from "@mui/material";
import { Formik, FormikErrors } from "formik";
import * as Yup from 'yup';
import NepaliDate from "nepali-date-converter";
//
import { getAllActiveStudents, getStudentPreviousDue, getStudentsWithBillNo } from "@/services/student.service";
import { addPayment } from "@/services/payment.service";
import { getClasses } from "@/services/class.service";
//
import FormContainer from "@/components/layouts/FormContainer";
import { SnackBarContext } from "@/context/snackBar";
import { StudentClassType, StudentMiniBillNo } from "@/types";
import AnimateButton from "@/components/@extended/AnimateButton";
import paths from "@/routes/path";
import { PageTitle } from "@/components/shared";

type SetFieldValueType = (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{ student_id: null; amount: number; remarks: string; payee: string; }>>;
type StudentListType = {
    show: boolean
} & StudentMiniBillNo;

export default function AddPaymentPage() {
    const [students, setStudents] = useState<Array<StudentListType>>([]);
    const [classes, setClasses] = useState<Array<StudentClassType>>([]);
    const { showAlert } = useContext(SnackBarContext);
    const nepali_date = new NepaliDate(Date.now());
    const [due_amount, setDueAmount] = useState(0);
    const navigate = useNavigate();

    function filterStudent(selected_class: number | null, setFieldValue: SetFieldValueType) {
        const student_records = [...students];
        setFieldValue('student_id', 0);
        setFieldValue('account_name', '');
        setStudents(student_records.map((item) => {
            return {
                ...item,
                show: selected_class === null ? true : selected_class === item.class_id
            }
        }))
    }

    function handleStudentNameChange(event: SelectChangeEvent<unknown>, setFieldValue: SetFieldValueType) {
        if (typeof event.target.value === "number") {
            setFieldValue('student_id', event.target.value);
            const selected_student = students.find((el) => el.id === event.target.value);
            getDueAmount(event.target.value);
            if (selected_student) {
                setFieldValue('account_name', `${selected_student.first_name} ${selected_student.last_name}`);
                setFieldValue('bill_no', selected_student.bill_no)
            }
        }
    }

    function getDueAmount(student_id: number){
        const current_date = new Date();
        current_date.setMonth(current_date.getMonth() + 1);
        const next_month_nepali_date = new NepaliDate(current_date);
        getStudentPreviousDue(student_id, next_month_nepali_date.getMonth() + 1, next_month_nepali_date.getYear())
            .then(data =>{
                if(typeof data === "number"){
                    setDueAmount(data);
                }
            })
            .catch(err => {
                console.trace(err)
                setDueAmount(0);
            })
    }

    useEffect(() => {
        getStudentsWithBillNo()
            .then(data => {
                if (Array.isArray(data)) {
                    setStudents(data.map((value) => {
                        return {
                            ...value,
                            show: true
                        }
                    }));
                }
            })
            .catch(err => console.error(err));
        getClasses(1, 1000)
            .then(data => {
                if (typeof data === "string") {
                    const class_data = JSON.parse(data);
                    setClasses(class_data);
                }
            })
            .catch(err => console.error(err))
    }, []);

    return (
        <Box>
            <PageTitle title="Add Payment" />
            <FormContainer>
                <Formik
                    initialValues={{
                        student_id: null,
                        amount: 0,
                        bill_no: null,
                        remarks: '',
                        payee: '',
                        account_name: '',
                        receiver: ''
                    }}
                    validationSchema={Yup.object().shape({
                        student_id: Yup.number().required('Student Name is Required'),
                        amount: Yup.number().required('Please Provide Amount'),
                        account_name: Yup.string().trim().required(' Account Name is Required'),
                        remark: Yup.string().trim(),
                        bill_no: Yup.number()
                    })}
                    onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                        const nepali_month = nepali_date.getMonth() + 1;
                        const nepali_year = nepali_date.getYear();
                        setStatus({ success: false });
                        setSubmitting(true);
                        if (values.student_id) {
                            addPayment({
                                amount: values.amount,
                                student_id: values.student_id,
                                remarks: values.remarks,
                                payee: values.payee,
                                account_name: values.account_name,
                                nepali_month,
                                nepali_year,
                                bill_no: values.bill_no,
                                due_amount,
                                receiver: values.receiver
                            })
                                .then((data) => {
                                    showAlert("Payment Added", 'success');
                                    if (typeof data === "number") {
                                        navigate(paths.printPayment(data));
                                    }
                                    setErrors({});
                                })
                                .catch(err => {
                                    showAlert('Error Adding Payment ' + err, 'error');
                                    console.error(err);
                                })
                                .finally(() => {
                                    setSubmitting(false);
                                })
                        }

                    }}
                >
                    {
                        ({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="student">Class</InputLabel>
                                            <Select onChange={(event) => {
                                                filterStudent(parseInt(event.target.value as string) || null, setFieldValue);
                                                return handleChange
                                            }}>
                                                {classes.map((cl) => <MenuItem value={cl.id}>{cl.class}</MenuItem>)}
                                            </Select>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="student">Student Name</InputLabel>
                                            <Select id="student" onChange={(event) => handleStudentNameChange(event, setFieldValue)} name="student_id">
                                                {students.filter(item => item.show).map((student) => <MenuItem value={student.id}>{`${student.first_name} ${student.last_name}`}</MenuItem>)}
                                            </Select>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="payee">Payee name</InputLabel>
                                            <OutlinedInput id="payee" type="text" value={values.payee} name='payee' onChange={handleChange} fullWidth error={Boolean(errors.payee && touched.payee)} />
                                            {
                                                touched.payee && errors.payee && (
                                                    <FormHelperText error id="account-name-error-helper">
                                                        {errors.payee}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="bill_no">Bill No</InputLabel>
                                            <OutlinedInput id="bill_no" type="number" value={values.bill_no} name='bill_no' onChange={handleChange} fullWidth error={Boolean(errors.bill_no && touched.bill_no)} />
                                            {
                                                touched.bill_no && errors.bill_no && (
                                                    <FormHelperText error id="account-name-error-helper">
                                                        {errors.bill_no}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="account_name">Account Name</InputLabel>
                                            <OutlinedInput id="account_name" type="text" value={values.account_name} disabled={true} name='account_name' fullWidth error={Boolean(errors.account_name)} />
                                            {
                                                touched.account_name && errors.account_name && (
                                                    <FormHelperText error id="account-name-error-helper">
                                                        {errors.account_name}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="due-amount">Due Amount</InputLabel>
                                            <OutlinedInput id="due-amount" type="number" disabled={true} value={due_amount} fullWidth  />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="amount">Payment Amount</InputLabel>
                                            <OutlinedInput id="amount" type="number" value={values.amount} onBlur={handleBlur} onChange={handleChange} name='amount' fullWidth error={Boolean(errors.amount && touched.receiver)} />
                                            {
                                                touched.amount && errors.amount && (
                                                    <FormHelperText error id="class-error-helper">
                                                        {errors.amount}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="receiver">Receiver Name</InputLabel>
                                            <OutlinedInput id="receiver" type="string" value={values.receiver} onBlur={handleBlur} onChange={handleChange} name='receiver' fullWidth error={Boolean(errors.receiver && touched.receiver)} />
                                            {
                                                touched.receiver && errors.receiver && (
                                                    <FormHelperText error id="class-error-helper">
                                                        {errors.receiver}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="remark">Remark</InputLabel>
                                            <OutlinedInput id="remark" type="string" value={values.remarks} onBlur={handleBlur} onChange={handleChange} name='remarks' fullWidth error={Boolean(errors.remarks)} />
                                            {
                                                touched.remarks && errors.remarks && (
                                                    <FormHelperText error id="class-error-helper">
                                                        {errors.remarks}
                                                    </FormHelperText>
                                                )
                                            }
                                        </Stack>
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
                        )
                    }
                </Formik>
            </FormContainer>
        </Box>
    )
}