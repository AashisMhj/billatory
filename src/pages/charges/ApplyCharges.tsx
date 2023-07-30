import { Button, Checkbox, Grid, InputLabel, IconButton, List, ListItem, ListItemButton, ListItemText, OutlinedInput, Paper, Stack, Typography, Select, MenuItem } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import NepaliDate from 'nepali-date-converter';
//
import { applyCharge, getChargeDetail, getStudentOfCharge } from '@/services/charge.service';
import { SnackBarContext } from '@/context/snackBar';
import { CloseOutlined } from '@mui/icons-material';
import { Months } from '@/utils/constants';
import { PageTitle } from '@/components/shared';
import FormContainer from '@/components/layouts/FormContainer';

interface StudentCharge {
    id: number,
    first_name: string,
    mid_name?: string,
    last_name: string,
    class: string,
    class_id: number,
    charge_id?: number,
    display: boolean
}
const CurrentNepaliDate = new NepaliDate(Date.now())

export default function ApplyChargesPage() {
    const [selected_student, setSelectedStudent] = useState<Array<StudentCharge>>([]);
    const [all_students, setAllStudents] = useState<Array<StudentCharge>>([]);
    const [charge_title, setChargeTitle] = useState('');
    const [charge_amount, setChargeAmount] = useState(0);
    const [search_text, setSearchText] = useState('');
    const [selected_year, setSelectedYear] = useState(CurrentNepaliDate.getYear());
    const [selected_month, setSelectedMonth] = useState(Months[CurrentNepaliDate.getMonth()]?.value);
    const { showAlert } = useContext(SnackBarContext);

    const { id } = useParams();

    function handleCheckBoxChange(value: boolean, student: StudentCharge) {
        if (value) {
            let temp = [...selected_student];
            temp.push(student);
            setSelectedStudent(temp);
        } else {
            let index = selected_student.findIndex(i => i.id === student.id);
            if (index !== -1) {
                let temp = [...selected_student];
                temp.splice(index, 1);
                setSelectedStudent(temp);

            }
        }
    }

    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setSearchText(event.target.value);
    }

    function removeSelectedUser(remove_index: number) {
        let temp = [...selected_student];
        temp.splice(remove_index, 1);
        setSelectedStudent(temp);
    }

    function handleSubmit() {
        if (id) {
            const parsed_id = parseInt(id);
            if (parsed_id) {
                const selected_students_id = selected_student.map((item) => item.id);
                applyCharge(parsed_id, selected_students_id, charge_amount, charge_title, selected_month, selected_year)
                    .then(_ => {
                        showAlert('Charges applied', 'success');
                    })
                    .catch(error => {
                        console.error(error);
                        showAlert('Failed to Apply Charge' + error, 'error');
                    })
            } else {
                showAlert('Failed to Parse Id', 'error');

            }
        } else {
            showAlert('Id not found', 'error');
        }
    }

    useEffect(() => {
        setSelectedStudent(all_students.filter((item) => item.charge_id));
    }, [all_students]);

    useEffect(() => {
        const lower_search = search_text.toLowerCase();
        if (search_text && search_text.trim().length > 0) {
            setAllStudents(all_students.map(e => {
                const display = (e.first_name.toLowerCase().includes(lower_search) || e.last_name.toLowerCase().includes(lower_search));
                return {
                    ...e,
                    display
                }
            }))
        } else {
            setAllStudents(all_students.map(el => ({ ...el, display: true })))
        }
    }, [search_text])

    useEffect(() => {
        if (id) {
            const parse_id = parseInt(id);
            if (parse_id) {

                //
                getChargeDetail(parse_id)
                    .then((data) => {
                        if (typeof data === "object" && data !== null && 'charge_title' in data && 'amount' in data && "class_id" in data) {
                            if (typeof data.charge_title === "string") {
                                setChargeTitle(data.charge_title);
                            }
                            if (typeof data.amount === "number") {
                                setChargeAmount(data.amount)
                            }

                            if (typeof data.class_id === "number") {
                                getStudentOfCharge(parse_id)
                                    .then((s_data) => {
                                        if (Array.isArray(s_data)) {
                                            let students_data = s_data.map((item) => {
                                                return {
                                                    ...item,
                                                    display: true
                                                }
                                            }) as Array<StudentCharge>;
                                            setAllStudents(students_data.filter(el => el.class_id === data.class_id));
                                        }
                                    })
                                    .catch(error => {
                                        console.error(error)
                                    });
                            }

                        }
                    })
                    .catch(error => console.error(error));
            }
        }
    }, [])
    return (
        <>
            <Grid container rowSpacing={2} columnSpacing={2}>
                <Grid item xs={12}>
                    <PageTitle title="Apply Fees" />
                </Grid>
                <Grid item xs={12}>
                    <FormContainer>
                        <Grid container spacing={3} alignItems='end' justifyContent='center' >
                            <Grid item xs={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="title" required={true}>Title</InputLabel>
                                    <OutlinedInput
                                        id="title"
                                        type="text"
                                        value={charge_title}
                                        name="charge_title"
                                        onChange={(event) => setChargeTitle(event.target.value)}
                                        placeholder="Title"
                                        fullWidth
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="amount" required={true}>Amount</InputLabel>
                                    <OutlinedInput
                                        id="amount"
                                        type="text"
                                        value={charge_amount}
                                        name="charge_amount"
                                        onChange={(event) => setChargeAmount(parseInt(event.target.value) || 0)}
                                        placeholder="amount"
                                        fullWidth
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={2}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="year" required={true}>Year</InputLabel>
                                    <OutlinedInput
                                        id="year"
                                        type="number"
                                        value={selected_year}
                                        name="organization_name"
                                        onChange={(event) => setSelectedYear(parseInt(event.target.value))}
                                        placeholder="Current Year"
                                        fullWidth
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={2}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="month" required={true}>Month</InputLabel>
                                    <Select labelId="month" value={selected_month} onChange={(event) => setSelectedMonth(typeof event.target.value === "number" ? event.target.value : parseInt(event.target.value))}>
                                        {
                                            Months.map((item) => <MenuItem key={item.value} value={item.value}>{item.month_name}</MenuItem>)
                                        }
                                    </Select>
                                </Stack>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant='contained' onClick={handleSubmit}>Apply</Button>
                            </Grid>
                        </Grid>
                    </FormContainer>
                </Grid>
                <Grid item xs={12}>
                    <FormContainer>
                        <Grid container>
                            <Grid item xs={9} padding={1} spacing={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <OutlinedInput value={search_text} onChange={handleSearchChange} placeholder='Search' />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Paper style={{ maxHeight: 700, overflow: 'auto' }}>
                                            <List dense>
                                                {
                                                    all_students.filter(el => el.display).map((item) => (
                                                        <ListItem key={item.id} secondaryAction={
                                                            <Checkbox sx={{ color: 'black' }} color='primary' checked={selected_student.findIndex((value) => value.id === item.id) !== -1} onChange={(_, value) => handleCheckBoxChange(value, item)} />
                                                        }>
                                                            <ListItemButton >
                                                                <ListItemText primary={`${item.first_name} ${item.last_name}`} secondary={item.class} />
                                                            </ListItemButton>
                                                        </ListItem>
                                                    ))
                                                }
                                            </List>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={3} padding={1} spacing={2}>
                                <Typography variant='h5'>Selected Total: {selected_student.length}</Typography>
                                <List dense sx={{ width: '100%', bgcolor: 'Background.paper' }}>
                                    {
                                        selected_student.map((item, index) => (
                                            <ListItem key={item.id} secondaryAction={<IconButton edge="end" onClick={() => removeSelectedUser(index)} >
                                                <CloseOutlined />
                                            </IconButton>}>
                                                <ListItemButton>
                                                    <ListItemText primary={`${item.first_name} ${item.last_name}`} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))
                                    }
                                </List>
                            </Grid>
                        </Grid>
                    </FormContainer>
                </Grid>
            </Grid>
        </>
    )
}