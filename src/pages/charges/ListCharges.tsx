import { useEffect, useState, useContext } from 'react';
import { TableContainer, Table, TableCell, TableHead, TableRow, TableBody, Button, Typography, Grid, Tooltip, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
//
import { PageTitle, TableTop } from '@/components/shared';
import { ChargesType, ChargesFilterType, StudentClassType } from '@/types';
import { getCharges, getChargeCount } from '@/services/charge.service';
import { getNoOfPage, addComma } from '@/utils/helper-function';
import { AddChargeModal, EditChargeModal, ChargesFilterModal } from '@/components/pages/charges/listCharges';
import { SnackBarContext } from '@/context/snackBar';
import paths from '@/routes/path';
import { getClassesOnly } from '@/services/class.service';
import MainCard from '@/components/layouts/MainCard';
//
const tableHeads = [
    'Id',
    'Charge',
    'class',
    'Amount',
    'Actions'
];


export default function ListCharges() {
    const [charges, setCharges] = useState<Array<ChargesType>>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [total_rows, setTotalRow] = useState<number>(0);
    const [filter_class, setFilterClass] = useState<number>();
    const [is_edit_modal_open, setIsEditModalOpen] = useState(false);
    const [is_add_model_open, setIsAddModalOpen] = useState(false);
    const [is_filter_modal_open, setIsFilterModalOpen] = useState(false);
    const [edit_data, setEditData] = useState<ChargesType | null>(null);
    const [classes, setClasses] = useState<Array<StudentClassType>>([]);
    const { showAlert } = useContext(SnackBarContext);

    function handlePaginationChange(_: any, new_page: number) {
        setPage(new_page);
    }

    function handleFilterSubmit(value: ChargesFilterType) {
        if (value.class_id) {
            setFilterClass(value.class_id);
        }
        if (limit !== value.limit) {
            setLimit(value.limit);
        }
    }
    function clearFilter() {
        setFilterClass(undefined);
    }

    function fetchData() {
        getCharges(page, limit, filter_class)
            .then((data) => {
                if (typeof data === "string") {
                    const charges_data = JSON.parse(data);
                    setCharges(charges_data);
                }
            })
            .catch(err => {
                showAlert('Error ' + err, 'error');
                console.error(err);
            });

        // 
        getChargeCount(filter_class)
            .then(data => {
                if (typeof data === "number") {
                    setTotalRow(data);
                }
            })
            .catch(err => console.error(err))
    }

    function handleEditClick(_: any, data: ChargesType) {
        setIsEditModalOpen(true);
        setEditData(data);
    }

    useEffect(() => {
        getClassesOnly()
            .then((data) => {
                setClasses(data as Array<StudentClassType>)
            })
            .catch(error => console.error(error))
    }, [])

    useEffect(() => {
        fetchData();
    }, [page, limit, filter_class]);
    return (
        <>
            <Grid container rowSpacing={2} columnSpacing={2}>
                <Grid item xs={12}>
                    <PageTitle title="Fee Charges" actions={
                        <Button variant='contained' color='primary' onClick={() => setIsAddModalOpen(true)}>Add Charge</Button>
                    } />
                </Grid>
                <Grid item xs={12} >
                    <MainCard boxShadow>
                        <Grid container rowSpacing={2} columnSpacing={2} alignItems='center'>
                            <Grid item xs={12}>
                                <Typography variant='h6'>Filter</Typography>
                            </Grid>
                            <Grid item lg={2}  sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="class">Class</InputLabel>
                                    <Select labelId="class" id="class" value={filter_class} name='class' onChange={(event) => setFilterClass(typeof event.target.value === "number" ? event.target.value : parseInt(event.target.value))}>
                                        {
                                            classes.map((cl) => <MenuItem value={cl.id}>{cl.class}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item lg={2} sm={3} >
                                <Button onClick={clearFilter} variant='contained' color='primary'>Reset Filter</Button>
                            </Grid>
                        </Grid>
                    </MainCard>
                </Grid>
                <Grid item xs={12}>
                    <MainCard boxShadow>
                        <TableTop title="Fee Charges List" limit={limit} setLimit={setLimit} total_page_count={total_rows} handlePaginationChange={handlePaginationChange} />
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
                                            tableHeads.map((item: string, index) => (
                                                <TableCell key={index} padding='normal' sortDirection={false}>{item}</TableCell>
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
                                                    {addComma(charge.amount)}
                                                </TableCell>
                                                <TableCell>
                                                    <Box display='flex' gap={4}>

                                                    <RouterLink to={paths.applyCharges(charge.id)}>
                                                        <Button variant='contained' color='success'>
                                                            Apply Charges
                                                        </Button>
                                                    </RouterLink>
                                                        <Button size='large' variant='contained' color='primary' onClick={(event) => handleEditClick(event, charge)}>Edit</Button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </MainCard>
                </Grid>
            </Grid>
            <AddChargeModal open={is_add_model_open} handleClose={() => setIsAddModalOpen(false)} onSubmit={() => fetchData()} />
            <EditChargeModal data={edit_data} open={is_edit_modal_open} handleClose={() => setIsEditModalOpen(false)} onSubmit={() => fetchData()} />
            <ChargesFilterModal open={is_filter_modal_open} value={{ class_id: filter_class, limit }} handleClose={() => setIsFilterModalOpen(false)} onSubmit={handleFilterSubmit} />
        </>
    )
}