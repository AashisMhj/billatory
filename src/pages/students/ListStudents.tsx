import { TableContainer, Grid, Table, TableCell, TableHead, Switch, TableRow, TableBody, Tooltip, Pagination, Typography, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import CreditCardOutlinedIcon from '@ant-design/icons/CreditCardOutlined';
import ReceiptIcon from '@mui/icons-material/Receipt';
//
import { StudentStatus } from '@/components/pages/students/listStudents';
import { StudentType, StudentsTableFilterType } from '@/types';
import { EditFilled, FilterOutlined, PlusCircleFilled, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import paths from '@/routes/path';
import { getStudents, getStudentRowCount, updateStudentStatus } from '@/services/student.service';
import { getNoOfPage } from '@/utils/helper-function';
import { StudentsTableFilter } from '@/components/pages/students/listStudents';

const tableHeads = [
    'Id',
    'Name',
    'Class',
    'Roll No',
    'DOB',
    'status',
    'Actions',
];


export default function ListStudents() {
    const [student_data, setStudentData] = useState<Array<StudentType>>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [total_rows, setTotalRow] = useState<number>(0);
    const [filtered_class, setFilterClass] = useState<number>();
    const [is_open_filter_modal, setOpenFilterModal] = useState(false);
    function handlePaginationChange(_: any, new_page: number) {
        setPage(new_page);
    }

    function handleFilterSubmit(value: StudentsTableFilterType) {
        if (value.class) {
            setFilterClass(value.class);
        }
        if (limit !== value.limit) {
            setLimit(value.limit);
        }
    }

    function handleSwitchChange(event: React.ChangeEvent<HTMLInputElement>, checked: boolean, student_id: number) {
        updateStudentStatus(student_id, checked)
            .then(data => {
                fetchData();
            })
            .catch(err => console.log(err))
    }

    function fetchData() {
        getStudents(page, limit, filtered_class)
            .then((data) => {
                if (typeof data === "string") {
                    const student_data = JSON.parse(data);
                    setStudentData(student_data);
                }
            })
            .catch(err => {
                console.log(err)
            });

        // 
        getStudentRowCount()
            .then(data => {
                if (typeof data === "number") {
                    setTotalRow(data);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        fetchData();
    }, [page, filtered_class, limit]);

    return (
        <>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item>
                            <Typography variant='h4'>Students</Typography>
                        </Grid>
                        <Grid item>
                            <RouterLink to={paths.createStudent}>
                                <IconButton color='warning'>
                                    <PlusCircleFilled />
                                </IconButton>
                            </RouterLink>
                            <IconButton color='info' onClick={() => setOpenFilterModal(true)}>
                                <FilterOutlined />
                            </IconButton>

                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    Total no of Students: {total_rows}
                </Grid>
                <Grid item xs={12}>
                    <TableContainer sx={{
                        width: '100%',
                        overflowX: 'auto',
                        position: 'relative',
                        display: 'block',
                        maxWidth: '100%',
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
                                    student_data.map((student: StudentType) => (
                                        <TableRow key={student.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                            <TableCell component="th" scope='row' align='left'>
                                                {student.id}
                                            </TableCell>
                                            <TableCell component="th" scope='row' align='left'>
                                                {`${student.first_name} ${student.last_name}`}
                                            </TableCell>
                                            <TableCell component="th" scope='row' align='left'>
                                                {student.class}
                                            </TableCell>
                                            <TableCell component="th" scope='row' align='left'>
                                                {student.roll_no}
                                            </TableCell>
                                            <TableCell>
                                                {student.date_of_birth}
                                            </TableCell>
                                            <TableCell>
                                                <Switch checked={student.is_active} onChange={(event, checked) => handleSwitchChange(event, checked, student.id)} />
                                                {/* <StudentStatus status={student.is_active} /> */}
                                            </TableCell>
                                            <TableCell>
                                                <RouterLink to={paths.editStudent(student.id)}>
                                                    <Tooltip title="Edit Info">
                                                        <IconButton color='primary'>
                                                            <EditFilled />
                                                        </IconButton>
                                                    </Tooltip>
                                                </RouterLink>
                                                <RouterLink to={paths.detailStudent(student.id)}>
                                                    <Tooltip title="Student Detail">
                                                        <IconButton color='info'>
                                                            <InfoCircleOutlined />
                                                        </IconButton>
                                                    </Tooltip>
                                                </RouterLink>
                                                <RouterLink to={paths.studentFees(student.id)}>
                                                    <Tooltip title="Students Fees">
                                                        <IconButton color="success">
                                                            <CreditCardOutlinedIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </RouterLink>
                                                <RouterLink to={paths.studentBill(student.id)}>
                                                    <Tooltip title="Student Bill">
                                                        <IconButton color="success">
                                                            <ReceiptIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </RouterLink>
                                                <RouterLink to={paths.studentCharges(student.id)}>
                                                    <Tooltip title="Student Charges">
                                                        <IconButton color="primary">
                                                            <CheckCircleOutlined />
                                                        </IconButton>
                                                    </Tooltip>
                                                </RouterLink>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid>
                    <Pagination count={getNoOfPage(total_rows, limit)} onChange={handlePaginationChange} color='secondary' />
                </Grid>
            </Grid >
            <StudentsTableFilter open={is_open_filter_modal} value={{ limit, class: filtered_class }} onSubmit={handleFilterSubmit} handleClose={() => setOpenFilterModal(false)} />
        </>
    )
}