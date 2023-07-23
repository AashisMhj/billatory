import { useEffect, useState } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { TableContainer, Table, TableCell, TableHead, TableRow, TableBody, Typography, Grid, Button, InputLabel, Select, FormControl, MenuItem, OutlinedInput } from '@mui/material';
import NepaliDate from 'nepali-date-converter';
//
import { Months } from '@/utils/constants';
import { FeesType, FeesFilterType, StudentClassType, StudentMiniType } from '@/types';
import { addComma, getSearchParams } from '@/utils/helper-function';
import { getFeeRowCount, getFees } from '@/services/fees.service';
import { AddFeeModal, EditFeesModal,} from '@/components/pages/fees/listFees';
import { PageTitle, TableTop } from '@/components/shared';
import { getClassesOnly } from '@/services/class.service';
import { getAllActiveStudents } from '@/services/student.service';
import MainCard from '@/components/layouts/MainCard';
import AnimateButton from '@/components/@extended/AnimateButton';
import paths from '@/routes/path';
const current_year = new NepaliDate(Date.now()).getYear();

const nepali_years = Array.from({ length: 20 }, (v, i) => current_year - i)
const tableHeads = [
    'Student',
    'Fee',
    'Year',
    'Month',
    'Amount',
    'Action'
]


export default function ListFees() {
    const [searchParams] = useSearchParams();
    const [fees, setFees] = useState<Array<FeesType>>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total_rows, setTotalRows] = useState(0);
    const [filter_class_id, setFilterClassId] = useState<number | null>(null);
    const [filter_student_id, setFilterStudentId] = useState<number | null>(getSearchParams(searchParams, "student_id"));
    const [classes, setClasses] = useState<Array<StudentClassType>>([]);
    const [filter_charge_id, setFilterChargeId] = useState<number | null>(null);
    const [filter_month, setFilterMonth] = useState<number | null>(null);
    const [filter_year, setFilterYear] = useState<number | null>(null);
    const [open_add_modal, setOpenAddModal] = useState(false)
    const [all_students, setAllStudents] = useState<Array<StudentMiniType>>([]);
    const [fee_edit_id, setFeeEditId] = useState<number | null>(null);


    function handlePaginationChange(event: any, new_page: number) {
        setPage(new_page);
    }
    function clearFilter() {
        setLimit(10);
        setFilterClassId(null);
        setFilterStudentId(null);
        setFilterMonth(null);
        setFilterYear(null);
    }

    function handleFilter(value: FeesFilterType) {
        console.log(value);
        setPage(1);
        if (value.limit !== limit) {
            setLimit(value.limit)
        }
        if (value.charge) {
            setFilterChargeId(value.charge);
        }
        if (value.class_id) {
            setFilterClassId(value.class_id);
        }
        if (value.student_id) {
            setFilterStudentId(value.student_id);
        }
        if (value.month) {
            setFilterMonth(value.month);
        }
        if (value.year) {
            setFilterYear(value.year);
        }
    }

    function fetchData() {
        getFees(page, limit, filter_class_id ? filter_class_id : undefined, filter_student_id ? filter_student_id : undefined, filter_charge_id ? filter_charge_id : undefined, filter_year ? filter_year : undefined, filter_month ? filter_month : undefined)
            .then((data) => {
                setFees(data as Array<FeesType>);
            })
            .catch(error => console.error(error));

        //
        getFeeRowCount(filter_class_id ? filter_class_id : undefined, filter_student_id ? filter_student_id : undefined, filter_charge_id ? filter_charge_id : undefined, filter_year ? filter_year : undefined, filter_month ? filter_month : undefined)
            .then((data) => {
                if (typeof data === "number") {
                    setTotalRows(data);
                }
            })
            .catch(error => console.error(error))

    }

    useEffect(() => {
        getClassesOnly()
            .then((data) => {
                setClasses(data as Array<StudentClassType>)
            })
            .catch(error => console.error(error));

        getAllActiveStudents()
            .then((data) => {
                setAllStudents(data as Array<StudentMiniType>)
            })
            .catch(error => console.error(error))
    }, [])

    useEffect(() => {
        fetchData()
    }, [page, limit, filter_class_id, filter_student_id, filter_charge_id, filter_year, filter_month]);


    return (
        <>
            <Grid container rowSpacing={2} columnSpacing={2}>
                <Grid item xs={12}>
                    <PageTitle title="Fees Transactions" actions={
                        <AnimateButton>
                            <Button size="large" variant='contained' color='primary' onClick={() => setOpenAddModal(true)}>
                                Add Fee
                            </Button>
                        </AnimateButton>

                    } />
                </Grid>
                <Grid item xs={12} >
                    <MainCard boxShadow>
                        <Grid container rowSpacing={2} columnSpacing={2} alignItems='center'>
                            <Grid item xs={12}>
                                <Typography variant='body2'>Filter</Typography>
                            </Grid>
                            <Grid item lg={1} md={2} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="class">Class</InputLabel>
                                    <Select labelId="class" id="class" value={filter_class_id} name='class' onChange={(event) => {
                                        if (event.target.value) {
                                            setFilterClassId(typeof event.target.value === "number" ? event.target.value : parseInt(event.target.value))
                                        }
                                    }}>
                                        {
                                            classes.map((cl) => <MenuItem value={cl.id}>{cl.class}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item lg={2} md={2} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="student">Student</InputLabel>
                                    <Select labelId="student" id="student" value={filter_student_id} name='student' onChange={(event) => {
                                        if (event.target.value) {
                                            setFilterStudentId(typeof event.target.value === "number" ? event.target.value : parseInt(event.target.value))
                                        }
                                    }}>
                                        {
                                            all_students.map((st) => <MenuItem value={st.id}>{`${st.first_name} ${st.last_name}`}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item lg={2} md={2} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="year">Year</InputLabel>
                                    <Select labelId="year" id="year" value={filter_year} name='year' onChange={(event) => {
                                        if (event.target.value) {
                                            setFilterYear(typeof event.target.value === "number" ? event.target.value : parseInt(event.target.value))
                                        }
                                    }}>
                                        {
                                            nepali_years.map((year) => <MenuItem value={year}>{year}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item lg={1} md={2} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="month">Month</InputLabel>
                                    <Select labelId="month" id="month" value={filter_month} name='month' onChange={(event) => {
                                        if (event.target.value) {
                                            setFilterMonth(typeof event.target.value === "number" ? event.target.value : parseInt(event.target.value))
                                        }
                                    }}>
                                        {
                                            Months.map((mo) => <MenuItem value={mo.value}>{mo.month_name}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item lg={1} md={2} sm={3}>
                                <Button onClick={clearFilter} variant='contained' color='primary'>Reset Filter</Button>
                            </Grid>
                        </Grid>
                    </MainCard>
                </Grid>
                <Grid item xs={12}>
                    <MainCard boxShadow>
                        <TableTop title='Fee Transactions' limit={limit} setLimit={setLimit} handlePaginationChange={handlePaginationChange} total_page_count={total_rows} />
                        <TableContainer sx={{
                            width: '100%',
                            overflowX: 'auto',
                            position: 'relative',
                            display: 'block',
                            maxWidth: '100%',
                            background: 'white',
                            '& td, & th': { whiteSpace: 'nowrap' }
                        }}>
                            <Table aria-labelledby="student-table"
                                sx={{
                                    '& .MuiTableCell-root:first-of-type': {
                                        pl: 2
                                    },
                                    '& .MuiTableCell-root:last-of-type': {
                                        pr: 3
                                    }
                                }}>
                                <TableHead>
                                    <TableRow>
                                        {
                                            tableHeads.map((item: string) => (
                                                <TableCell key={item} padding='normal' sortDirection={false}>{item}</TableCell>
                                            ))
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        fees.map((fee: FeesType) => (
                                            <TableRow key={fee.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderLeft: 6, borderColor: fee.payment_id ? 'green' : 'red' }} >
                                                <TableCell component="th" scope='row' align='left'>
                                                    {`${fee.student_first_name} ${fee.student_mid_name || ''} ${fee.student_last_name}`}
                                                </TableCell>
                                                <TableCell component="th" scope='row' align='left'>
                                                    {fee.title}
                                                </TableCell>
                                                <TableCell>
                                                    {fee.year}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        fee.month && Months[fee.month - 1] ? Months[fee.month - 1].month_name : ''
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {addComma(fee.amount)}
                                                </TableCell>
                                                <TableCell>
                                                    <AnimateButton>
                                                        {
                                                            fee.payment_id ? <RouterLink to={paths.printPayment(fee.payment_id)} > <Button variant='contained' color='success'>Print</Button> </RouterLink> : <Button variant='contained' color='primary' onClick={() => setFeeEditId(fee.id)}>Edit</Button>
                                                        }
                                                    </AnimateButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </MainCard>
                </Grid>
            </Grid>
            <AddFeeModal open={open_add_modal} onSubmit={() => fetchData()} handleClose={() => setOpenAddModal(false)} />
            <EditFeesModal handleClose={() => setFeeEditId(null)} onSubmit={fetchData} id={fee_edit_id} />
        </>
    )
}