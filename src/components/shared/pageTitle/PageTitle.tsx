import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftCircleOutlined from '@ant-design/icons/LeftCircleOutlined';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';



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
            <IconButton onClick={goBack} size='large'>
                <LeftCircleOutlined />
            </IconButton>
            <Typography variant='h3' color='primary' marginRight={2}>{title}</Typography>
        </Box>
        <Box>
            {actions}
        </Box>
    </Box>
}