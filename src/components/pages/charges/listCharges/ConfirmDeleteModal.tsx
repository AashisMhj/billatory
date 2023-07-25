import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { Box, Button, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Modal, Select, Stack, SxProps, Typography } from "@mui/material";
//
import AnimateButton from "@/components/@extended/AnimateButton";
import { ChargesFilterType, StudentClassType } from "@/types";
import { getClasses } from "@/services/class.service";
import { disableChargeData } from "@/services/fees.service";
import { useContext } from "react";
import { SnackBarContext } from "@/context/snackBar";

interface Props {
    delete_id: number | null,
    handleClose: () => void,
    onSubmit: () => void
}
const style: SxProps = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    background: 'white',
    borderRadius: '10px',
    p: 4
}


export default function ConfirmDeleteModal({ delete_id, handleClose, onSubmit }: Props) {

    const {showAlert} = useContext(SnackBarContext)

    function handleDisable() {
        if(delete_id){
            disableChargeData(delete_id)
                .then(data => {
                    showAlert('Charge Deleted', 'success');
                    handleClose();
                    onSubmit()
                })
                .catch(err => {
                    console.error(err);
                    showAlert('' + err, 'error')
                })
        }
    }

    return (
        <Modal
            open={Boolean(delete_id)}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant="h5" >Filter Data</Typography>
                    <IconButton onClick={() => handleClose()} size="large" color="error">
                        <CloseCircleOutlined />
                    </IconButton>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h1">Delete Charge ?</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="outlined" size="large" color="secondary" onClick={handleClose} fullWidth>Cancel</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <AnimateButton>
                            <Button disableElevation fullWidth size="large" onClick={handleDisable} variant="contained" color="error">
                                Delete
                            </Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}