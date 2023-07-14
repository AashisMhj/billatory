import { Box, Button, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useParams, Link as BrowserLink } from "react-router-dom";
import { getStudentDetail } from "@/services/student.service";
import { useEffect, useState } from "react";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { StudentType } from "@/types";
import paths from '@/routes/path';
import { LeftCircleOutlined } from "@ant-design/icons";

export default function StudentDetail() {
    const [studentData, setStudentData] = useState<StudentType | null>(null);

    const { id } = useParams();
    useEffect(() => {
        if (id) {
            getStudentDetail(parseInt(id))
                .then(data => {
                    if (typeof data === "string") {
                        const student = JSON.parse(data);
                        setStudentData(student);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [])
    if (!studentData) {
        return <></>
    }
    return (
        <>
            <Box display='flex' alignItems='center' justifyContent='space-between'>
                <BrowserLink to={paths.studentsList}>
                    <Button variant="contained" startIcon={<LeftCircleOutlined />}>
                        Back
                    </Button>
                </BrowserLink>
                <Typography variant="h4">Student Detail</Typography>
                <div></div>
            </Box>
            <Container>
                <Grid container spacing={2} marginY='10px'>
                    <BrowserLink to={id ? paths.studentFees(parseInt(id)) : '#'} >
                        <IconButton>
                            <CreditCardIcon />
                        </IconButton>
                    </BrowserLink>
                </Grid>
                <TableContainer component={Paper}>
                    <Table >
                        <TableBody>
                            <TableRow>
                                <TableCell><Typography variant="h6" fontWeight='bold'>Name</Typography></TableCell>
                                <TableCell>{`${studentData.first_name} ${studentData.mid_name || ''} ${studentData.last_name} `}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6" fontWeight='bold'>Class</Typography></TableCell>
                                <TableCell>{studentData.class}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6" fontWeight='bold'>Gender</Typography></TableCell>
                                <TableCell>{studentData.gender}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6" fontWeight='bold'>Roll No</Typography></TableCell>
                                <TableCell>{studentData.roll_no}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6" fontWeight='bold'>Address</Typography></TableCell>
                                <TableCell>{studentData.address || 'Not Provided'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6" fontWeight='bold'>Father Name</Typography></TableCell>
                                <TableCell>{studentData.father_name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6" fontWeight='bold'>Mother Name</Typography></TableCell>
                                <TableCell>{studentData.mother_name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6" fontWeight='bold'>Date of Birth</Typography></TableCell>
                                <TableCell>{studentData.date_of_birth}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6" fontWeight='bold'>Phone No</Typography></TableCell>
                                <TableCell>{studentData.phone_no}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell><Typography variant="h6" fontWeight='bold'>Email</Typography></TableCell>
                                <TableCell>{studentData.email || 'Not provided'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6" fontWeight='bold'>Guardian Name</Typography></TableCell>
                                <TableCell>{studentData.guardian_name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6" fontWeight='bold'>Relation with guardian</Typography></TableCell>
                                <TableCell>{studentData.guardian_relation}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6" fontWeight='bold'>Emergency Contact</Typography></TableCell>
                                <TableCell>{studentData.emergency_contact}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

            </Container>
        </>
    )
}