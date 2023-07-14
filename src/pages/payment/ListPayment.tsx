import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TableContainer, IconButton, Box, Table, TableCell, TableHead, TableRow, TableBody, Button, Pagination, Typography, Grid } from '@mui/material';
import { EditOutlined, PlusCircleFilled, FilterOutlined, PrinterOutlined } from '@ant-design/icons';
//
import paths from '@/routes/path';
import { PaymentType } from '@/types';
import { addComma, getNoOfPage } from '@/utils/helper-function';
import { getPaymentRowCount, getPayments } from '@/services/payment.service';
const tableHeads = [
    'Name',
    'Amount',
    'Payment Date',
    'Payee',
    'Actions',
];

export default function ListPaymentPage() {
    const [payments, setPayments] = useState<Array<PaymentType>>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [total_rows, setTotalRows] = useState(0);

    function fetchData() {
        getPayments(page, limit)
            .then(data => {
                if (typeof data === "string") {
                    const payment_data = JSON.parse(data);
                    setPayments(payment_data);
                }
            })
            .catch(error => console.log(error));

        //
        getPaymentRowCount()
            .then(data => {
                if(typeof data === "number"){
                    setTotalRows(data);
                }
            })
            .catch(err => console.log(err))
    }

    function handlePaginationChange(event: any, new_page: number) {
        setPage(new_page);
    }

    useEffect(() => {
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
                            <RouterLink to={paths.addPayment}>
                                <IconButton color='warning'>
                                    <PlusCircleFilled />
                                </IconButton>
                            </RouterLink>
                            <IconButton color='info' >
                                <FilterOutlined />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography>Total Count: {total_rows}</Typography>
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
                                            <TableCell component="th" scope='row' align='left'>
                                                {`${payment.student_first_name} ${payment.student_last_name}`}
                                            </TableCell>
                                            <TableCell>
                                                {addComma( payment.amount)}
                                            </TableCell>
                                            <TableCell>
                                                {payment.payee}
                                            </TableCell>
                                            <TableCell>
                                                {payment.created_at}
                                            </TableCell>
                                            <TableCell>
                                                <RouterLink to={paths.printPayment(payment.id)}>
                                                    <IconButton color='primary'>
                                                        <PrinterOutlined />
                                                    </IconButton>
                                                </RouterLink>
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