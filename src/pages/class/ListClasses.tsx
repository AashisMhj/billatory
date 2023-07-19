import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
import { TableContainer, Table, IconButton, Tooltip, TableCell, TableHead, TableRow, TableBody, Pagination, Grid, Stack, InputLabel, Select, FormHelperText, Button, MenuItem, FormControl, Typography } from '@mui/material';
import { EditFilled, PlusCircleFilled, FilterOutlined, UserOutlined } from '@ant-design/icons';
//
import { PageTitle } from '@/components/shared';
import { ClassTableType, ClassFilterType } from '@/types';
import { getClassRowCount, getClasses } from '@/services/class.service';
import { EditModal, FilterModal, AddClassModal } from '@/components/pages/class/listClasses';
import { getNoOfPage } from '@/utils/helper-function';
import paths from '@/routes/path';
import { Formik } from 'formik';
import { DropdownLimitValues } from '@/utils/constants';
import AnimateButton from '@/components/@extended/AnimateButton';

const tableHeads = [
    'Class',
    'Male',
    'Female',
    'Actions',
];

export default function ListClasses() {
    const [classes, setClasses] = useState<Array<ClassTableType>>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total_page_count, setTotalPageCount] = useState(0);
    const [open_edit_modal, setOpenEditModal] = useState(false);
    const [open_add_modal, setOpenAddModal] = useState(false);
    const [edit_data, setEditData] = useState<ClassTableType | null>(null);
    const [open_filter_modal, setOpenFilterModal] = useState(false);

    function handlePaginationChange(_: any, new_page: number) {
        setPage(new_page);
    }

    function fetchData() {
        getClasses(page, limit)
            .then((data) => {
                if (typeof data === "string") {
                    const class_data = JSON.parse(data);
                    setClasses(class_data);
                }
            })
            .catch(console.log);
        //
        getClassRowCount()
            .then(data => {
                if (typeof data === "number") {
                    setTotalPageCount(data);
                }
            })
            .catch(err => console.log(err));
    }

    function handleFilterSubmit(value: ClassFilterType) {
        setPage(1);
        setLimit(value.limit);
    }

    function handleEditClick(_: any, data: ClassTableType) {
        setOpenEditModal(true);
        setEditData(data);
    }

    useEffect(() => {
        fetchData();
    }, [page, limit]);


    return (
        <>
            <Grid container rowSpacing={2} columnSpacing={2}>
                <Grid item xs={12}>
                    <PageTitle title="Classes" actions={
                        <>
                            <Tooltip title="Add Class">
                                <IconButton size='large' color='warning' onClick={() => setOpenAddModal(true)}>
                                    <PlusCircleFilled />
                                </IconButton>
                            </Tooltip>
                            {/* <Tooltip title="Filter Class Data">
                                <IconButton size='large' color='info' onClick={() => setOpenFilterModal(true)}>
                                    <FilterOutlined />
                                </IconButton>
                            </Tooltip> */}
                        </>
                    } />
                </Grid>
                <Grid item xs={12} >
                    <Grid container rowSpacing={2} columnSpacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='body2'>Filter</Typography>
                        </Grid>
                        <Grid item lg={1} md={2} sm={3}>
                            <FormControl fullWidth>
                                <InputLabel >Limit</InputLabel>
                                <Select labelId="limit" id='limit' value={limit} name="limit" onChange={(event) => setLimit(typeof event.target.value === "number" ? event.target.value : parseInt(event.target.value))}>
                                    {
                                        DropdownLimitValues.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    Total no of Class: {total_page_count}
                </Grid>
                <Grid item xs={12}>
                    <TableContainer sx={{
                        width: '100%',
                        overflowX: 'auto',
                        position: 'relative',
                        display: 'block',
                        background: '#fefefe',
                        maxWidth: '100%',
                        '& td, & th': { whiteSpace: 'nowrap' }
                    }}>
                        <Table aria-labelledby="class-table"
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
                                    classes.map((cl, index) => (
                                        <TableRow key={`${cl.id}-${index}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                            <TableCell component="th" scope='row' align='left'>
                                                {cl.class} <RouterLink to={`${paths.studentsList}?class_id=${cl.id}`}>
                                                    <Tooltip title={`Show Student of ${cl.class}`} >
                                                        <IconButton><UserOutlined /> </IconButton>
                                                    </Tooltip>
                                                </RouterLink>
                                            </TableCell>
                                            <TableCell component="th" scope='row' align='left'>
                                                {cl.male_count}
                                            </TableCell>
                                            <TableCell component="th" scope='row' align='left'>
                                                {cl.female_count}
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Edit Data">
                                                    <IconButton color='primary' onClick={(event) => handleEditClick(event, cl)}>
                                                        <EditFilled />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <Pagination count={getNoOfPage(total_page_count, limit)} onChange={handlePaginationChange} color='secondary' />
                </Grid>
            </Grid>
            <EditModal open={open_edit_modal} data={edit_data} handleClose={() => setOpenEditModal(false)} onSubmit={() => fetchData()} />
            {/* <FilterModal open={open_filter_modal} value={{ limit: limit }} handleClose={() => setOpenFilterModal(false)} onSubmit={handleFilterSubmit} /> */}
            <AddClassModal open={open_add_modal} handleClose={() => setOpenAddModal(false)} onSubmit={() => fetchData()} />
        </>
    )
}