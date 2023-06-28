import { useEffect, useState } from 'react';
import { TableContainer, Box, Table, TableCell, TableHead, TableRow, TableBody, Button, Pagination, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { EditOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
//
import { ClassType, ClassFilterType } from '@/types';
import path from '@/routes/path';
import { getClasses } from '@/services/class.service';
import { EditModal, FilterModal, AddClassModal } from '@/components/pages/class/listClasses';


const tableHeads = [
    'Id',
    'Class',
    'action'
];

export default function ListClasses() {
    const [classes, setClasses] = useState<Array<ClassType>>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total_page_count, setTotalPageCount] = useState(0);
    const [open_edit_modal, setOpenEditModal] = useState(false);
    const [open_add_modal, setOpenAddModal] = useState(false);
    const [edit_data, setEditData] = useState<ClassType | null>(null);
    const [open_filter_modal, setOpenFilterModal] = useState(false);

    function handlePaginationChange(event: any, new_page: number) {
        setPage(new_page);
    }

    function fetchData() {
        getClasses(page, limit)
            .then((data) => {
                if(typeof data === "string"){
                    const class_data = JSON.parse(data);
                    setClasses(class_data);
                }
            })
            .catch(console.log)
    }

    function handleFilterSubmit(value: ClassFilterType) {
        setLimit(value.limit);
    }

    function handleEditClick(event: any, data: ClassType) {
        setOpenEditModal(true);
        setEditData(data);
    }

    useEffect(() => {
        fetchData();
    }, [page]);


    return (
        <Box>
            <Box>
                <Typography variant='h2'>Classes</Typography>
                <Button startIcon={<PlusOutlined />} onClick={() => setOpenAddModal(true)}> Add</Button>
                <Button>
                    <Button variant='contained' onClick={() => setOpenFilterModal(true)} startIcon={<FilterOutlined />}>Filter</Button>
                </Button>
            </Box>
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
                                    <TableCell key={item} padding='normal' sortDirection={false}>{item}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            classes.map((cl, index) => (
                                <TableRow key={cl.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                    <TableCell component="th" scope='row' align='left'>
                                        {cl.id}
                                    </TableCell>
                                    <TableCell component="th" scope='row' align='left'>
                                        {cl.class}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant='contained' onClick={(event) => handleEditClick(event, cl)} endIcon={<EditOutlined />}>
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Box>
                <Pagination count={total_page_count} onChange={handlePaginationChange} color='secondary' />
            </Box>
            {/* TODO when the user edits update data */}
            <EditModal open={open_edit_modal} data={edit_data} handleClose={() => setOpenEditModal(false)} onSubmit={() => fetchData()} />
            <FilterModal open={open_filter_modal} value={{ limit: limit }} handleClose={() => setOpenFilterModal(false)} onSubmit={handleFilterSubmit} />
            <AddClassModal open={open_add_modal} handleClose={() => setOpenAddModal(false)} onSubmit={() => fetchData()} />
        </Box>
    )
}