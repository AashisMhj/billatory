import { Box, Button } from "@mui/material";
import ReceiptIcon from '@mui/icons-material/Receipt';
import { EditFilled, FilterOutlined, PlusCircleFilled, InfoCircleOutlined, CheckCircleOutlined, CreditCardOutlined } from '@ant-design/icons';
import paths from "@/routes/path";
import { Link as RouterLinks } from "react-router-dom";
const items = [
    {
        "text": "StudentInfo",
        icon: <InfoCircleOutlined />,
        link: paths.detailStudent
    },
    {
        text: "Edit Detail",
        icon: <EditFilled />,
        link: paths.editStudent
    },
    {
        text: "Fees",
        icon: <CreditCardOutlined />,
        link: paths.studentFees
    },
    {
        text: "Bill",
        icon: <CreditCardOutlined />,
        link: paths.studentBill
    },
    {
        text: "Charges",
        icon: <CheckCircleOutlined />,
        link: paths.studentCharges
    }
]

export default function StudentTab({ id }: { id: number }) {

    return (
        <Box display='flex' alignItems='center'>
            {
                items.map((item) => <RouterLinks key={item.text} to={item.link(id)}>
                    <Button startIcon={item.icon}>
                        {item.text}
                    </Button>
                </RouterLinks>)
            }
        </Box>
    )
}