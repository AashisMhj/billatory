import { useEffect, useState } from 'react';
import { TableContainer, IconButton, Box, Table, TableCell, TableHead, TableRow, TableBody, Pagination, Typography, Grid } from '@mui/material';
import { EditOutlined, FilterOutlined, PlusCircleFilled } from '@ant-design/icons';
//
import { Months } from '@/utils/constants';
import { FeesType, FeesFilterType } from '@/types';
import { getNoOfPage, addComma } from '@/utils/helper-function';
import { getFeeRowCount, getFees } from '@/services/fees.service';
import { AddFeeModal, FeesFilterModal } from '@/components/pages/fees/listFees';

const tableHeads = [
    'Student',
    'Fee',
    'Year', 
    'Month',
    'Amount'
]


export default function ListFees() {
    const [fees, setFees] = useState<Array<FeesType>>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total_rows, setTotalRows] = useState(0);
    const [open_filter_modal, setOpenFilterModal] = useState(false);
    const [filter_class_id, setFilterClassId] = useState<number | undefined>();
    const [filter_student_id, setFilterStudentId] = useState<number | undefined>();
    const [filter_charge_id, setFilterChargeId] = useState<number | undefined>();
    const [filter_month, setFilterMonth] = useState<number | undefined>();
    const [filter_year, setFilterYear] = useState<number | undefined>();
    const [open_add_modal, setOpenAddModal] = useState(false)


    function handlePaginationChange(event: any, new_page: number) {
        setPage(new_page);
    }
    function clearFilter(){
        setLimit(10);
        setFilterClassId(undefined);
        setFilterStudentId(undefined);
        setFilterMonth(undefined);
        setFilterYear(undefined);
    }

    function handleFilter(value: FeesFilterType){
        console.log(value);
        setPage(1);
        if(value.limit !== limit){
            setLimit(value.limit)
        }
        if(value.charge){
            setFilterChargeId(value.charge);
        }
        if(value.class_id){
            setFilterClassId(value.class_id);
        }
        if(value.student_id){
            setFilterStudentId(value.student_id);
        }
        if(value.month){
            setFilterMonth(value.month);
        }
        if(value.year){
            setFilterYear(value.year);
        }
    }
    function fetchData() {
        getFees(page, limit, filter_class_id, filter_student_id, filter_charge_id,  filter_year, filter_month)
            .then((data) => {
                console.log(data);
                setFees(data as Array<FeesType>);
            })
            .catch(error => console.log(error));

        //
        getFeeRowCount( filter_class_id, filter_student_id, filter_charge_id,  filter_year, filter_month)
            .then((data) => {
                if (typeof data === "number") {
                    setTotalRows(data);
                }
            })
            .catch(error => console.log(error))

    }

    useEffect(() => {
        fetchData()
    }, [page, limit, filter_class_id, filter_student_id, filter_charge_id, filter_year, filter_month]);


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
                            <IconButton color='info' onClick={() => setOpenFilterModal(true)} >
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
                                                {fee.year}
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    fee.month && Months[fee.month -1] ? Months[fee.month -1 ].month_name : ''
                                                }
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
            <FeesFilterModal open={open_filter_modal} onSubmit={handleFilter} handleClose={() => setOpenFilterModal(false)} clearFilter={clearFilter} value={{
                limit,
                charge: filter_charge_id,
                class_id: filter_class_id,
                student_id: filter_student_id,
                year: filter_year,
                month: filter_month,
            }} />
        </>
    )
}