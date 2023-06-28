import Dot from "@/components/@extended/Dot"
import { Stack, Typography } from "@mui/material"

interface Props{
    status: boolean
}
export default function OrderStatus({status}:Props){
    return (
        <Stack direction="row"  spacing={1} alignItems="center">
            <Dot color={status ? "success" : "error"} />
            <Typography>{status ? "Active" : "Disabled"}</Typography>
        </Stack>
    )
}