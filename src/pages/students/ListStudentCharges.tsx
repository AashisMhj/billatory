import { useState, useEffect } from 'react';
import { Checkbox, Container, FormControlLabel, Grid } from "@mui/material";
import { getCharges, getStudentCharges } from "@/services/charge.service";
import { ChargesType, StudentChargeType, } from '@/types';

export default function ListStudentCharges() {
    const [charges, setCharges] = useState<Array<ChargesType>>([])
    const [studentCharges, setStudentCharges] = useState<Array<StudentChargeType>>([]);

    useEffect(() => {
        getCharges(1, 1000)
            .then((data) => {
                
            })
            .catch(error => console.log(error))
    }, []);

    return (
        <Container>
            <Grid container>
                {
                    charges.map((charge) => (
                        <Grid key={charge.id}>
                            <FormControlLabel control={<Checkbox value={charge.id} />} label={charge.charge_title} />
                        </Grid>
                    ))

                }
            </Grid>
        </Container>
    )
}