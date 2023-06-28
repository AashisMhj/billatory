import { TableContainer, IconButton, Box, Table, TableCell, TableHead, TableRow, TableBody, Button, Pagination, Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { EditOutlined, PlusCircleFilled, FilterOutlined } from '@ant-design/icons';
//
import { PaymentType } from '@/types';
import { getNoOfPage } from '@/utils/helper-function';
const tableHeads = [
    'Actions',
    'Charge',
    'class',
    'Type',
    'Amount',
    'action'
];

export default function ListPaymentPage() {
    const [payments, setPayments] = useState<Array<PaymentType>>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [total_rows, setTotalRows] = useState(0);

    function fetchData(){
        // TODO get data
    }

    function handlePaginationChange(event: any, new_page:number){
        setPage(new_page);
    }

    useEffect(()=>{
        fetchData();
    }, [])
    return (
        <>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item>
                            <Typography variant='h4'>Payments</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton color='info' >
                                <FilterOutlined />
                            </IconButton>
                        </Grid>
                    </Grid>
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
                                    payments.map((payment: PaymentType) => (
                                        <TableRow key={payment.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                            <TableCell>
                                                <IconButton color='primary'>
                                                    <EditOutlined />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell component="th" scope='row' align='left'>
                                                {`${payment.student_first_name}`}
                                            </TableCell>
                                            <TableCell component="th" scope='row' align='left'>
                                                {payment.class}
                                            </TableCell>
                                            <TableCell>
                                                {payment.class}
                                            </TableCell>
                                            <TableCell>
                                                {payment.amount}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant='outlined' color='success'>
                                                    Apply Charge
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item>
                    <Box>
                        <Pagination count={getNoOfPage(total_rows, limit)} onChange={handlePaginationChange} color='primary' />
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}