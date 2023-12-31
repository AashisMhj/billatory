import { Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FeesType } from "@/types";
import { addComma } from "@/utils/helper-function";
import { getStudentFees } from "@/services/student.service";
import { useParams } from "react-router-dom";

const tableHeads = [
    'Student',
    'Fee',
    'Date',
    'Amount'
]

export default function StudentFeePage() {
    const [fees, setFees] = useState<Array<FeesType>>([]);
    const {id} = useParams();
    useEffect(() => {
        if(id){
            const parsed_id = parseInt(id);
            if(parsed_id){
                getStudentFees(parsed_id)
                    .then((data) => {
                        setFees(data as Array<FeesType>);
                    })
                    .catch(error => console.error(error));
            }
        }
    }, []);
    return (
        <Container>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h4">Student Transactions</Typography>
                </Grid>
                <Grid item xs={12}>

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
                                        <TableRow key={fee.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderLeft: 12, borderColor: fee.payment_id ? 'green' : 'red' }} >
                                            <TableCell component="th" scope='row' align='left'>
                                                {`${fee.student_first_name} ${fee.student_mid_name || ''} ${fee.student_last_name}`}
                                            </TableCell>
                                            <TableCell component="th" scope='row' align='left'>
                                                {fee.title}
                                            </TableCell>
                                            <TableCell>
                                                {fee.created_at}
                                            </TableCell>
                                            <TableCell>
                                                {addComma(fee.amount)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>

    )
}