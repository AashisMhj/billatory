import { useEffect, useState, useContext } from 'react';
import { TableContainer, Grid, Table, TableCell, TableHead, Switch, TableRow, TableBody, Tooltip, Pagination, Typography, IconButton, Checkbox, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
// icons
import CreditCardOutlinedIcon from '@ant-design/icons/CreditCardOutlined';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Print from '@mui/icons-material/Print';
import { EditFilled, FilterOutlined, PlusCircleFilled, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
//
import paths from '@/routes/path';
import { PageTitle, TableTop } from '@/components/shared';
import { StudentType, StudentsTableFilterType, StudentClassType } from '@/types';
import { getStudents, getStudentRowCount, updateStudentStatus } from '@/services/student.service';
import { getNoOfPage, getSearchParams } from '@/utils/helper-function';
import { StudentsTableFilter, DisableConfirmModal, BulkPrintModal, UpdateStudentClassModal, UpdateStudentStatusModal, ApplyChargeModal } from '@/components/pages/students/listStudents';
import { SnackBarContext } from '@/context/snackBar';
import { DropdownLimitValues } from '@/utils/constants';
import { getClassesOnly } from '@/services/class.service';
import AnimateButton from '@/components/@extended/AnimateButton';
import MainCard from '@/components/layouts/MainCard';

const tableHeads = [
    'checkbox',
    'Name',
    'Class',
    'Roll No',
    'DOB',
    'status',
    'Actions',
];


export default function ListStudents() {
    const [searchParams] = useSearchParams();
    const [student_data, setStudentData] = useState<Array<StudentType>>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [total_rows, setTotalRow] = useState<number>(0);
    const [filtered_class, setFilterClass] = useState<number | null>(getSearchParams(searchParams, "class_id"));
    const [show_active, setShowActive] = useState(true);
    const [disable_id, setDisableId] = useState<number | null>(null);
    const [checkbox_ids, setCheckBoxIds] = useState<Array<number>>([]);
    const [show_bulk_print, setShowBulkPrint] = useState(false);
    const [show_update_class_modal, setShowUpdateClassModal] = useState(false);
    const [show_update_status_modal, setShowStatusModal] = useState(false);
    const [show_apply_charge_modal, setShowApplyChargeModal] = useState(false);
    const [classes, setClasses] = useState<Array<StudentClassType>>([]);
    const { showAlert } = useContext(SnackBarContext);

    function handlePaginationChange(_: any, new_page: number) {
        setPage(new_page);
    }

    function clearFilter() {
        setLimit(10);
        setShowActive(true);
        setFilterClass(null);
    }

    function handleFilterSubmit(value: StudentsTableFilterType) {
        if (value.class) {
            setFilterClass(value.class);
        }
        if (limit !== value.limit) {
            setLimit(value.limit);
        }
        setShowActive(value.show_active);
    }

    function handleBulkPrint() {
        setShowBulkPrint(true);
    }

    function changeStatus(id: number, checked: boolean) {
        updateStudentStatus(id, checked)
            .then(_ => {
                showAlert('Student Status Updated', 'success');
                fetchData();
            })
            .catch(err => {
                showAlert('Failed to Update Status ' + err, 'error');
                console.error(err)
            })
    }

    function handleCheckBoxChange(value: boolean, student_id: number) {
        if (value) {
            let temp = [...checkbox_ids];
            temp.push(student_id);
            setCheckBoxIds(temp);
        } else {
            let temp = [...checkbox_ids];
            const index = temp.indexOf(student_id);
            if (index >= 0) {
                temp.splice(index, 1);
                setCheckBoxIds(temp);
            }
        }
    }

    function handleSelectAll(_: React.ChangeEvent<HTMLInputElement>, value: boolean) {
        if (value) {
            setCheckBoxIds(student_data.map(item => item.id));
        } else {
            setCheckBoxIds([]);
        }
    }

    function handleSwitchChange(_: React.ChangeEvent<HTMLInputElement>, checked: boolean, student_id: number) {
        if (checked) {
            changeStatus(student_id, checked);
        } else {
            setDisableId(student_id);
        }

    }

    function fetchData() {
        getStudents(page, limit, show_active, filtered_class ? filtered_class : undefined)
            .then((data) => {
                if (typeof data === "string") {
                    const student_data = JSON.parse(data);
                    setStudentData(student_data);
                }
                setCheckBoxIds([]);
            })
            .catch(err => {
                console.error(err)
            });

        // 
        getStudentRowCount(show_active, filtered_class ? filtered_class : undefined)
            .then(data => {
                if (typeof data === "number") {
                    setTotalRow(data);
                }
            })
            .catch(err => {
                showAlert('Error ' + err, 'error');
                console.error(err);
            });

        setCheckBoxIds([]);
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
    }, [page, filtered_class, limit, show_active]);

    return (
        <>
            <Grid container rowSpacing={2} columnSpacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <PageTitle title='Students' actions={
                            <>
                                <RouterLink to={paths.createStudent}>
                                    <AnimateButton>
                                        <Button variant='contained'>Add Student</Button>
                                    </AnimateButton>
                                </RouterLink>
                            </>
                        } />
                    </Grid>
                </Grid>

                <Grid item xs={12} >
                    <MainCard boxShadow>
                        <Grid container rowSpacing={2} columnSpacing={2} alignItems='center'>
                            <Grid item xs={12}>
                                <Typography variant='h6'>Filter</Typography>
                            </Grid>
                            <Grid item xs={12} >
                                <Box sx={{ display: 'flex', gap: '8px' }}>
                                    <Button startIcon={<Print />} variant='outlined' sx={{ borderRadius: '50px' }} onClick={handleBulkPrint} disabled={checkbox_ids.length === 0}>Print</Button>
                                    <Button variant='outlined' sx={{ borderRadius: '50px' }} disabled={checkbox_ids.length === 0} onClick={() => setShowUpdateClassModal(true)}>Update Class</Button>
                                    <Button variant='outlined' sx={{ borderRadius: '50px' }} disabled={checkbox_ids.length === 0} onClick={() => setShowStatusModal(true)}>Change Status</Button>
                                    <Button variant='outlined' sx={{ borderRadius: '50px' }} disabled={checkbox_ids.length === 0} onClick={() => setShowApplyChargeModal(true)}>Apply Charge</Button>

                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box display='flex' gap={4}>
                                    <FormControl >
                                        <InputLabel htmlFor="class">Class</InputLabel>
                                        <Select labelId="class" id="class" value={filtered_class} name='class' onChange={(event) => {
                                            if (event.target.value) {
                                                setFilterClass(typeof event.target.value === "number" ? event.target.value : parseInt(event.target.value))
                                            }
                                        }}>
                                            {
                                                classes.map((cl) => <MenuItem key={cl.id} value={cl.id}>{cl.class}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel >Limit</InputLabel>
                                        <Select labelId="limit" id='limit' value={show_active ? "Active" : "Inactive"} defaultValue="Active" name="limit" onChange={(event) => setShowActive(event.target.value === "Active")}>
                                            {
                                                ["Active", "Inactive"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                    <Button onClick={clearFilter} variant='contained' color='primary'>Reset Filter</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </MainCard>
                </Grid>
                <Grid item xs={12}>
                    <MainCard boxShadow>
                        <TableTop title="Students List" limit={limit} setLimit={setLimit} total_page_count={total_rows} handlePaginationChange={handlePaginationChange} />
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
                                                item === "checkbox" ? (
                                                    <TableCell key={item} padding='normal' align='center' sortDirection={false}><Checkbox onChange={handleSelectAll} checked={checkbox_ids.length === student_data.length} /></TableCell>
                                                ) : (<TableCell key={item} padding='normal' sortDirection={false}>{item}</TableCell>)
                                            ))
                                        }

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        student_data.map((student: StudentType, index: number) => (
                                            <TableRow key={student.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell component="th" scope="row" align="center">
                                                    <Checkbox checked={checkbox_ids.includes(student.id)} onChange={(_, checked) => handleCheckBoxChange(checked, student.id)} />
                                                </TableCell>
                                                <TableCell component="th" scope='row' align='left'>
                                                    {student.gender === "male" ? <MaleIcon sx={{ color: '#0000ff' }} /> : <FemaleIcon sx={{ color: '#F89880' }} />}
                                                    {`${student.first_name} ${student.last_name}`}
                                                </TableCell>
                                                <TableCell component="th" scope='row' align='left'>
                                                    {student.class}
                                                </TableCell>
                                                <TableCell component="th" scope='row' align='left'>
                                                    {student.roll_no}
                                                </TableCell>
                                                <TableCell>
                                                    {student.date_of_birth}
                                                </TableCell>
                                                <TableCell>
                                                    <Switch checked={student.is_active} onChange={(event, checked) => handleSwitchChange(event, checked, student.id)} />
                                                </TableCell>
                                                <TableCell>
                                                    <RouterLink to={paths.editStudent(student.id)}>
                                                        <Tooltip title="Edit Info">
                                                            <IconButton size='large' color='primary'>
                                                                <EditFilled />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </RouterLink>
                                                    <RouterLink to={paths.detailStudent(student.id)}>
                                                        <Tooltip title="Student Detail">
                                                            <IconButton size='large' color='info'>
                                                                <InfoCircleOutlined />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </RouterLink>
                                                    <RouterLink to={`${paths.listFees}?student_id=${student.id}`}>
                                                        <Tooltip title="Students Transaction">
                                                            <IconButton size='large' color="success">
                                                                <CreditCardOutlinedIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </RouterLink>
                                                    <RouterLink to={paths.studentBill(student.id)}>
                                                        <Tooltip title="Student Bill">
                                                            <IconButton size='large' color="success">
                                                                <ReceiptIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </RouterLink>
                                                    <RouterLink to={paths.studentCharges(student.id)}>
                                                        <Tooltip title="Student Charges">
                                                            <IconButton size='large' color="primary">
                                                                <CheckCircleOutlined />
                                                            </IconButton>
                                                        </Tooltip>
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
            </Grid >
            <DisableConfirmModal id={disable_id} onSubmit={(id) => changeStatus(id, false)} handleClose={() => setDisableId(null)} />
            <BulkPrintModal open={show_bulk_print} onSubmit={() => setCheckBoxIds([])} handleClose={() => setShowBulkPrint(false)} student_ids={checkbox_ids} />
            <UpdateStudentClassModal open={show_update_class_modal} student_ids={checkbox_ids} handleClose={() => setShowUpdateClassModal(false)} onSubmit={fetchData} />
            <UpdateStudentStatusModal open={show_update_status_modal} student_ids={checkbox_ids} handleClose={() => setShowStatusModal(false)} new_status={!show_active} onSubmit={fetchData} />
            <ApplyChargeModal filtered_class={filtered_class} open={show_apply_charge_modal} student_ids={checkbox_ids} handleClose={() => setShowApplyChargeModal(false)} onSubmit={() => setCheckBoxIds([])} />
        </>
    )
}