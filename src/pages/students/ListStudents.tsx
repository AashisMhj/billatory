import { TableContainer, Box, Table, TableCell, TableHead, TableRow, TableBody, Button, Pagination, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
//
import { StudentStatus } from '@/components/pages/students/listStudents';
import { StudentType, StudentsTableFilterType } from '@/types';
import { EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import paths from '@/routes/path';
import { getStudents, getStudentRowCount } from '@/services/student.service';
import { getNoOfPage } from '@/utils/helper-function';

const tableHeads = [
    'Name',
    'Class',
    'DOB',
    'status',
    'action',
];


export default function ListStudents() {
    const [student_data, setStudentData] = useState<Array<StudentType>>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [total_rows, setTotalRow] = useState<number>(10);
    const [filer_class, setFilterClass] = useState<number| null>(null);

    function handlePaginationChange(_:any, new_page:number){
        setPage(new_page);
    }

    function handleFilterSubmit(value:StudentsTableFilterType ){
        if(value.class){
            setFilterClass(value.class);
        }
        if(limit !== value.limit){
            setLimit(value.limit);
        }
    }
    function fetchData(){
        getStudents(page, limit)
        .then((data) =>{
            if(typeof data === "string"){
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
        .then(data =>{
            console.log(data);
            if(typeof data === "string"){
                const count =parseInt( JSON.parse(data)) || 0;
                setTotalRow(count);
            }
        })
        .catch(err =>{
            console.log(err);
        })
    }
    
    useEffect(() => {
        fetchData();
    }, [page]);
    return (
        <Box>
            <Box>
                <Typography variant='h2'>Students</Typography>
                <Box>
                    <RouterLink to={paths.createStudent}>
                        <Button startIcon={<PlusCircleFilled />}>Add</Button>
                    </RouterLink>
                    <Button variant='contained' >Filter</Button>
                </Box>
            </Box>
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
                                    <TableCell>
                                        <RouterLink to={paths.editStudent(student.id)}>
                                            <Button variant='contained' endIcon={<EditOutlined />}>
                                                Edit
                                            </Button>
                                        </RouterLink>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Box>
                <Pagination count={getNoOfPage(total_rows, limit)} onChange={handlePaginationChange} color='secondary' />
            </Box>
        </Box>
    )
}