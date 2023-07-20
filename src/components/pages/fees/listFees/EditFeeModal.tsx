import { useState, useEffect } from "react";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { Box, Button, Grid, IconButton, InputLabel, Modal, OutlinedInput, Stack, SxProps, Typography } from "@mui/material";
import AnimateButton from "@/components/@extended/AnimateButton";
import { getFeeDetail, updateFeeAmount } from "@/services/fees.service";
import { FeesType } from "@/types";


interface Props {
    handleClose: () => void,
    onSubmit: () => void,
    id?: number | null
}
const style: SxProps = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'white',
    borderRadius: '10px',
    p: 4
}


export default function BulkPrintModal({ handleClose, onSubmit, id }: Props) {
    const [amount, setAmount] = useState(0);

    function handleSubmit() {
        if (id) {
            updateFeeAmount(id, amount)
                .then(data => {
                    handleClose();
                    onSubmit();
                })
                .catch(err => console.error(err))
        }
    }

    useEffect(() => {
        if (id) {
            getFeeDetail(id)
                .then(data => {
                    let fee_detail = data as FeesType;
                    setAmount(fee_detail.amount);
                })
                .catch(err => console.error(err))
        }
    }, [id])

    return (
        <Modal
            open={Boolean(id)}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant="h5" >Print</Typography>
                    <IconButton color="error" onClick={() => handleClose()} size="large">
                        <CloseCircleOutlined />
                    </IconButton>
                </Box>
                <Box>
                    <Grid container rowSpacing={2} columnSpacing={2}>
                        <Grid item xs={12}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="fee-amount">Fee Amount</InputLabel>
                                <OutlinedInput id="fee-amount" value={amount} type="number" onChange={(event) => setAmount(parseInt(event.target.value))} />
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <AnimateButton>
                                <Button variant="contained" onClick={handleSubmit}> Update</Button>
                            </AnimateButton>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Modal>
    )
}