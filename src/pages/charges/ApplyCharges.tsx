import { Button, Checkbox, Grid, InputLabel, List, ListItem, ListItemButton, ListItemText, OutlinedInput, Paper, Stack, Typography } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
//
import { applyCharge, getChargeDetail, getStudentOfCharge } from '@/services/charge.service';
import { ChargesType } from '@/types';
import { SnackBarContext } from '@/context/snackBar';


interface StudentCharge {
    id: number,
    first_name: string,
    mid_name?: string,
    last_name: string,
    class: string,
    charge_id?: number
}

export default function ApplyChargesPage() {
    const [selected_student, setSelectedStudent] = useState<Array<StudentCharge>>([]);
    const [all_students, setAllStudents] = useState<Array<StudentCharge>>([]);
    // const [charge_detail, setChargeDetail] = useState<ChargesType | null>(null)
    const [charge_title, setChargeTitle] = useState('');
    const [charge_amount, setChargeAmount] = useState(0);
    const [search_text, setSearchText] = useState('');
    const {showAlert} = useContext(SnackBarContext);

    const { id } = useParams();

    function handleCheckBoxChange(value:boolean, student:StudentCharge){
        if(value){
            // TODO add 
            let temp = [...selected_student];
            temp.push(student);
            setSelectedStudent(temp);
        }else{
            // TODo remove
            let index = selected_student.findIndex(i => i.id === student.id);
            if(index !== -1){
                let temp = [...selected_student];
                console.log(index);
                const new_array = temp.splice(index, 1)
                console.log(new_array);
                console.log(temp);
                setSelectedStudent(temp);

            }
        }
    }

    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        setSearchText(event.target.value);
        // TODO filter
    }

    function handleSubmit(){
        if(id){
            const parsed_id = parseInt(id);
            if(parsed_id){
                const selected_students_id = selected_student.map((item) => item.id);
                applyCharge(parsed_id, selected_students_id, charge_amount, charge_title)
                    .then(data => {
                        showAlert('Charges applied', 'success');
                    })
                    .catch(error =>{
                        console.log(error);
                        showAlert('Failed to Apply Charge'+error, 'error');
                    })
            }else{
                showAlert('Failed to Parse Id', 'error');

            }
        }else{
            showAlert('Id not found', 'error');
        }

    }

    useEffect(()=>{
        setSelectedStudent(all_students.filter((item) => item.charge_id));
    }, [])

    useEffect(() => {
        if (id) {
            const parse_id = parseInt(id);
            if (parse_id) {
                getStudentOfCharge(parse_id)
                    .then((data) => {
                        console.log(data)
                        // TODO set selected student
                        setAllStudents(data as Array<StudentCharge>);
                    })
                    .catch(error => {
                        console.log(error)
                    });

                //
                getChargeDetail(parse_id)
                    .then((data) => {
                        console.log(data, 'detail');
                        if(typeof data === "object" && data !== null && 'charge_title' in data && 'amount' in data){
                            if(typeof data.charge_title === "string"){
                                setChargeTitle(data.charge_title);
                            }
                            if(typeof data.amount === "number"){
                                setChargeAmount(data.amount)
                            }

                        }
                    })
                    .catch(error => console.log(error))
            }
        }
    }, [])
    return (
        <>
            <Grid container spacing={3} sx={{background: 'white'}}>
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="title" required={true}>Title</InputLabel>
                                <OutlinedInput
                                    id="title"
                                    type="text"
                                    value={charge_title}
                                    name="organization_name"
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
                                    name="organization_name"
                                    onChange={(event) => setChargeAmount(parseInt(event.target.value))}
                                    placeholder="amount"
                                    fullWidth
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant='contained' onClick={handleSubmit}>Apply</Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={7}>
                    <OutlinedInput value={search_text} onChange={handleSearchChange} placeholder='Search'/>
                    <Paper style={{ maxHeight: 700, overflow: 'auto' }}>
                        <List dense>
                            {
                                all_students.map((item) => (
                                    <ListItem key={item.id} secondaryAction={
                                        <Checkbox color='success' checked={selected_student.findIndex((value) => value.id === item.id) !== -1} onChange={(_, value) => handleCheckBoxChange(value, item)}  />
                                    }>
                                        <ListItemButton>
                                            <ListItemText primary={`${item.first_name} ${item.last_name}`} secondary={item.class} />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={5}>
                    <Typography>Selected Total: {selected_student.length}</Typography>
                    <List dense>
                        {
                            selected_student.map(item => (
                                <ListItem>
                                    <Typography >{`${item.first_name} ${item.last_name}`}</Typography>
                                </ListItem>
                            ))
                        }
                    </List>
                </Grid>
            </Grid>
        </>
    )
}