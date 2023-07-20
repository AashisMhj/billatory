import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
//
import { DropdownLimitValues } from '@/utils/constants';
import { getNoOfPage } from '@/utils/helper-function';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    limit: number,
    setLimit: Dispatch<SetStateAction<number>>,
    total_page_count: number,
    handlePaginationChange: (_: any, value: number) => void,
    title: string
}

export default function TableTop({ limit, setLimit, total_page_count, handlePaginationChange, title }: Props) {
    return (
        <Box display='flex' alignItems='center' justifyContent='space-between' gap={2}>
            <Box>
                <Typography variant='h6'>{title}</Typography>
            </Box>
            <Box display='flex' alignItems='center' justifyContent='end' gap={2}>
                <FormControl >
                    <InputLabel >Limit</InputLabel>
                    <Select labelId="limit" id='limit' value={limit} name="limit" onChange={(event) => setLimit(typeof event.target.value === "number" ? event.target.value : parseInt(event.target.value))}>
                        {
                            DropdownLimitValues.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <Typography> Total Rows: {total_page_count}</Typography>
                <Pagination count={getNoOfPage(total_page_count, limit)} onChange={handlePaginationChange} color='primary' variant='outlined' shape='rounded' />
            </Box>
        </Box>
    )
}