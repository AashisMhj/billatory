import Dot from "@/components/@extended/Dot"
import { Stack, Typography } from "@mui/material"

interface Props{
    type: boolean
}
export default function ChargeStatusType({type}:Props){
    return (
        <Stack direction="row"  spacing={1} alignItems="center">
            <Dot color={type ? "success" : "error"} />
            <Typography>{type ? "Regular": "Non Regular"}</Typography>
        </Stack>
    )
}