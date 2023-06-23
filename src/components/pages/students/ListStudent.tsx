import { TableContainer, Box, Table, TableCell, TableHead, TableRow, TableBody, } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { StudentType } from '@/types';

const tableHeads = [
    'Name',
    'Class'
]

export default function ListStudents() {
    const [student_data, setStudentData] = useState<Array<StudentType>>([]);
    const [page, setPage] = useState<number>();
    useEffect(() => {
        // TODO get data
    }, [])
    return (
        <Box>
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
                                    <TableCell align='center' padding='normal' sortDirection={false}></TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            student_data.map((student:StudentType) => (
                                <TableRow key={student.id}  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                    <TableCell component="th" scope='row' align='left'>
                                        {`${student.first_name} ${student.last_name}`}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}