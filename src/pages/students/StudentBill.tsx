import { Bill } from "@/components/pages/students/studentBill"
import { BillItems } from "@/types"
import { Container } from "@mui/material"
const dummyitems:Array<BillItems> = [
    {index: 1, title: 'Tutation', amount: 5000},
    {index: 2, title: 'Tutation', amount: 5000},
    {index: 3, title: 'Tutation', amount: 5000},
    {index: 4, title: 'Tutation', amount: 5000},
    {index: 5, title: 'Tutation', amount: 5000},

]
export default function StudentBillPage(){
    return (
        <Container>
            <Bill previous_due={40000} bill_no={1111} month="Jan" student_class="One" bill_items={dummyitems} date="2020-12-12" student_name="Monkey Luffy" roll_no={12} />
        </Container>
    )
}