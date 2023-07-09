import { useEffect, useState } from 'react';
import { TableContainer, IconButton, Box, Table, TableCell, TableHead, TableRow, TableBody, Button, Pagination, Typography, Grid } from '@mui/material';
import { EditOutlined, FilterOutlined, PlusCircleFilled } from '@ant-design/icons';
//
import { FeesType } from '@/types';
import { getNoOfPage, addComma } from '@/utils/helper-function';
import { getFeeRowCount, getFees } from '@/services/fees.service';
import { AddFeeModal } from '@/components/pages/fees/listFees';

const tableHeads = [
    'Student',
    'Fee',
    'Date',
    'Amount'
]


export default function ListFees() {
    const [fees, setFees] = useState<Array<FeesType>>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total_rows, setTotalRows] = useState(0);
    const [open_filter_modal, setOpenFilterModal] = useState(false);
    const [open_add_modal, setOpenAddModal] = useState(false)


    function handlePaginationChange(event: any, new_page: number) {
        setPage(new_page);
    }
    function fetchData() {
        getFees(page, limit)
            .then((data) => {
                setFees(data as Array<FeesType>);
            })
            .catch(error => console.log(error));

        //
        getFeeRowCount()
            .then((data) => {
                if (typeof data === "number") {
                    setTotalRows(data);
                }
            })
            .catch(error => console.log(error))

    }

    useEffect(() => {
        fetchData()
    }, [page])

    return (
        <>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item>
                            <Typography variant='h4'>Fee Charges</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton color='warning' onClick={() => setOpenAddModal(true)}>
                                <PlusCircleFilled />
                            </IconButton>
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
                <Grid item>
                    <Box>
                        <Pagination count={getNoOfPage(total_rows, limit)} onChange={handlePaginationChange} color='primary' />
                    </Box>
                </Grid>
            </Grid>
            <AddFeeModal open={open_add_modal} onSubmit={() => fetchData()} handleClose={() => setOpenAddModal(false)} />
        </>
    )
}