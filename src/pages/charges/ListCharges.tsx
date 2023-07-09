import { useEffect, useState, useContext } from 'react';
import { TableContainer, IconButton, Box, Table, TableCell, TableHead, TableRow, TableBody, Button, Pagination, Typography, Grid } from '@mui/material';
import { EditOutlined, PlusCircleFilled, FilterOutlined } from '@ant-design/icons';
//
import { ChargesType, ChargesFilterType } from '@/types';
import { getCharges, getChargeCount, applyCharge } from '@/services/charge.service';
import { getNoOfPage, addComma } from '@/utils/helper-function';
import { ChargeStatusType, AddChargeModal, EditChargeModal } from '@/components/pages/charges/listCharges';
import { SnackBarContext } from '@/context/snackBar';
//
const tableHeads = [
    'Id',
    'Charge',
    'class',
    'Type',
    'Amount',
    'Actions',
    'Actions'
];


export default function ListCharges() {
    const [charges, setCharges] = useState<Array<ChargesType>>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [total_rows, setTotalRow] = useState<number>(0);
    const [filter_class, setFilterClass] = useState<number | null>(null);
    const [is_edit_modal_open, setIsEditModalOpen] = useState(false);
    const [is_add_model_open, setIsAddModalOpen] = useState(false);
    const [edit_data, setEditData] = useState<ChargesType | null>(null);
    const { showAlert } = useContext(SnackBarContext);

    function handlePaginationChange(_: any, new_page: number) {
        setPage(new_page);
    }

    function handleFilterSubmit(value: ChargesFilterType) {
        if (value.class) {
            setFilterClass(value.class);
        }
        if (limit !== value.limit) {
            setLimit(value.limit);
        }
    }

    function chargeHandler(charge_id: number) {
        applyCharge(charge_id)
            .then((data) => {
                if (data === 200) {
                    showAlert('Charges Applied', 'success');
                } else {
                    showAlert(' ' + data, 'info');
                }
            })
            .catch(error => {
                showAlert('Error ' + error, 'error');
                console.log(error)
            })
    }

    function fetchData() {
        getCharges(page, limit)
            .then((data) => {
                if (typeof data === "string") {
                    const charges_data = JSON.parse(data);
                    setCharges(charges_data);
                }
            })
            .catch(err => console.log(err));

        // 
        getChargeCount()
            .then(data => {
                if (typeof data === "number") {
                    setTotalRow(data);
                }
            })
            .catch(err => console.log(err))
    }

    function handleEditClick(_: any, data: ChargesType) {
        setIsEditModalOpen(true);
        setEditData(data);
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
                            <Typography variant='h4'>Fee Charges</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton color='warning' onClick={() => setIsAddModalOpen(true)} >
                                <PlusCircleFilled />
                            </IconButton>
                            <IconButton color='info' >
                                <FilterOutlined />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>

                </Grid>
                <Grid item xs={12}>
                    Total Row count: {total_rows}
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
                                    charges.map((charge: ChargesType) => (
                                        <TableRow key={charge.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                            <TableCell component="th" scope='row' align='left'>
                                                {charge.id}
                                            </TableCell>
                                            <TableCell component="th" scope='row' align='left'>
                                                {charge.charge_title}
                                            </TableCell>
                                            <TableCell component="th" scope='row' align='left'>
                                                {charge.class}
                                            </TableCell>
                                            <TableCell>
                                                <ChargeStatusType type={charge.is_regular} />
                                            </TableCell>
                                            <TableCell>
                                                {addComma(charge.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant='outlined' color='success' onClick={() => chargeHandler(charge.id)}>
                                                    Apply Charge
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton color='primary' onClick={(event) => handleEditClick(event, charge)}>
                                                    <EditOutlined />
                                                </IconButton>
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
            <AddChargeModal open={is_add_model_open} handleClose={() => setIsAddModalOpen(false)} onSubmit={() => fetchData()} />
            <EditChargeModal data={edit_data} open={is_edit_modal_open} handleClose={() => setIsEditModalOpen(false)} onSubmit={() => fetchData()} />
        </>
    )
}