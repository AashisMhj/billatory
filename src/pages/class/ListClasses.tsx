import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TableContainer, Table, IconButton, Tooltip, TableCell, TableHead, TableRow, TableBody, Pagination, Grid, InputLabel, Select, MenuItem, FormControl, Typography, Button, Paper, Box } from '@mui/material';
import { EditFilled, PlusCircleFilled, UserOutlined } from '@ant-design/icons';
//
import { PageTitle, TableTop } from '@/components/shared';
import { ClassTableType, ClassFilterType } from '@/types';
import { getClassRowCount, getClasses } from '@/services/class.service';
import { EditModal, AddClassModal } from '@/components/pages/class/listClasses';
import { getNoOfPage } from '@/utils/helper-function';
import paths from '@/routes/path';
import { DropdownLimitValues } from '@/utils/constants';
import AnimateButton from '@/components/@extended/AnimateButton';
import MainCard from '@/components/layouts/MainCard';

const tableHeads = [
    'Class',
    'Male',
    'Female',
    'Actions',
    'Actions'
];

export default function ListClasses() {
    const [classes, setClasses] = useState<Array<ClassTableType>>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total_page_count, setTotalPageCount] = useState(0);
    const [open_edit_modal, setOpenEditModal] = useState(false);
    const [open_add_modal, setOpenAddModal] = useState(false);
    const [edit_data, setEditData] = useState<ClassTableType | null>(null);

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
                        <Button variant='contained' onClick={() => setOpenAddModal(true)}> Add Class</Button>
                    } />
                </Grid>
                <Grid item xs={12}>
                    <MainCard boxShadow>
                        <TableTop title='Classes List' limit={limit} setLimit={setLimit} total_page_count={total_page_count} handlePaginationChange={handlePaginationChange} />
                        <TableContainer sx={{
                            width: '100%',
                            overflowX: 'auto',
                            position: 'relative',
                            display: 'block',
                            maxWidth: '100%',
                            borderRadius: '10px',
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
                                                    {cl.class}
                                                </TableCell>
                                                <TableCell component="th" scope='row' align='left'>
                                                    {cl.male_count}
                                                </TableCell>
                                                <TableCell component="th" scope='row' align='left'>
                                                    {cl.female_count}
                                                </TableCell>
                                                <TableCell>
                                                    <AnimateButton>
                                                        <Button color='warning' variant='contained' onClick={(event) => handleEditClick(event, cl)}>
                                                            Edit
                                                        </Button>
                                                    </AnimateButton>
                                                </TableCell>
                                                <TableCell>
                                                    <RouterLink to={`${paths.studentsList}?class_id=${cl.id}`} style={{ textDecoration: 'none' }}>
                                                        <AnimateButton>
                                                            <Button variant='contained'  >View Students</Button>
                                                        </AnimateButton>
                                                    </RouterLink>
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
            <EditModal open={open_edit_modal} data={edit_data} handleClose={() => setOpenEditModal(false)} onSubmit={() => fetchData()} />
            <AddClassModal open={open_add_modal} handleClose={() => setOpenAddModal(false)} onSubmit={() => fetchData()} />
        </>
    )
}