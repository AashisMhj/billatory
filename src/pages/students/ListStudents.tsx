import { TableContainer, Grid, Table, TableCell, TableHead, TableRow, TableBody, Button, Pagination, Typography, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
//
import { StudentStatus } from '@/components/pages/students/listStudents';
import { StudentType, StudentsTableFilterType } from '@/types';
import { EditFilled, FilterOutlined, PlusCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import paths from '@/routes/path';
import { getStudents, getStudentRowCount } from '@/services/student.service';
import { getNoOfPage } from '@/utils/helper-function';

const tableHeads = [
    'Actions',
    'Name',
    'Class',
    'DOB',
    'status',
];


export default function ListStudents() {
    const [student_data, setStudentData] = useState<Array<StudentType>>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [total_rows, setTotalRow] = useState<number>(10);
    const [filer_class, setFilterClass] = useState<number | null>(null);
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

    function fetchData() {
        getStudents(page, limit)
            .then((data) => {
                if (typeof data === "string") {
                    const student_data = JSON.parse(data);
                    console.log(student_data);
                    setStudentData(student_data);
                }
            })
            .catch(err => {
                console.log(err)
            });

        // 
        getStudentRowCount()
            .then(data => {
                console.log(data);
                if (typeof data === "string") {
                    const count = parseInt(JSON.parse(data)) || 0;
                    setTotalRow(count);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        fetchData();
    }, [page]);
    return (
        <>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item>
                            <Typography variant='h2'>Students</Typography>
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
                <Grid xs={12}>
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
                                            <TableCell>
                                                <RouterLink to={paths.editStudent(student.id)}>
                                                    <IconButton color='primary'>
                                                        <EditFilled />
                                                    </IconButton>
                                                </RouterLink>
                                                <RouterLink to={paths.detailStudent(student.id)}>
                                                    <IconButton color='info'>
                                                        <InfoCircleOutlined />
                                                    </IconButton>
                                                </RouterLink>
                                            </TableCell>
                                            <TableCell component="th" scope='row' align='left'>
                                                {`${student.first_name} ${student.last_name}`}
                                            </TableCell>
                                            <TableCell component="th" scope='row' align='left'>
                                                {student.class}
                                            </TableCell>
                                            <TableCell>
                                                {student.date_of_birth}
                                            </TableCell>
                                            <TableCell>
                                                <StudentStatus status={student.is_active} />
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
            </Grid>
        </>
    )
}