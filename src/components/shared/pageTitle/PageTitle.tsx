import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftCircleOutlined from '@ant-design/icons/LeftCircleOutlined';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';



type Props = {
    actions?: ReactNode,
    title: string
}

export default function HeaderLayout({ actions, title }: Props) {

    const navigate = useNavigate();

    function goBack() {
        navigate(-1);
    }

    return <Box display='flex' alignItems='center' width="100%" justifyContent='space-between'>
        <Box display='flex' alignItems='center'>
            <Typography variant='h4' marginRight={2}>{title}</Typography>
            {actions}
        </Box>
        <Box>
            <Button onClick={goBack} startIcon={<LeftCircleOutlined />}>
                <Typography sx={{textDecoration: 'underline'}} >
                    Back
                </Typography>
            </Button>
        </Box>
    </Box>
}