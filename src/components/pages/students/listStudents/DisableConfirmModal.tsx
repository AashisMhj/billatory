import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { Box, Button, IconButton, Modal,  SxProps, Typography } from "@mui/material";


interface Props {
    handleClose: () => void,
    onSubmit: (id:number) => void,
    id: number | null
}
const style: SxProps = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'white',
    border: '2px solid #000',
    p: 4
}


export default function DisableConfirmModal({ id, handleClose, onSubmit }: Props) {

    function handleSubmit(){
        if(id){
            onSubmit(id);
            handleClose();
        }
    }

    return (
        <Modal
            open={typeof id === "number"}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant="h5" >Disable Student {id}? </Typography>
                    <IconButton onClick={() => handleClose()} size="large">
                        <CloseCircleOutlined />
                    </IconButton>
                </Box>
                <Box display='flex' alignItems='center' justifyContent='space-around' padding='20px'>
                    <Button variant="contained" color="success" onClick={handleSubmit}>YES</Button>
                    <Button variant="outlined" color="error" onClick={() => handleClose()}>NO</Button>
                </Box>
            </Box>
        </Modal>
    )
}