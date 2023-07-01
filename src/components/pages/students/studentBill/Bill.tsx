import { BillProps } from "@/types";

export default function Bill({ bill_items, student_name, roll_no, date, student_class }: BillProps) {
    return <div className="bill-container">
        <div className='bill-contact-info'>
            <div>Pan No: 12345678</div>
            <div>Contact No: 234567</div>
        </div>
        <div className='school-name'>Holy Angel Sec English School</div>
        <div className='school-address'>Airport, Pokhara</div>
        <div className='bill-info'>
            <div>Bill No: 123456</div>
            <div className='bill-notice'>
                Notice Bill
            </div>
            <div>
                Date: 2020-10-10
            </div>
        </div>
        <div className='student-info'>
            <div>Name: Kai Doe</div>
            <div>Class: One</div>
            <div>Month: Jan</div>
            <div>Roll No: 10</div>
        </div>
        <div className='bill'>
            <div className='bill-header'>
                <div>Particular</div>
                <div>Rs</div>
                <div>Ps</div>
            </div>
            <div className='bill-content'>
                <div>
                    <ol>
                        <li>Transportation</li>
                        <li>Tution</li>
                        <li>Exam</li>
                        <li>Sports</li>
                    </ol>
                </div>
                <div>
                    <li>20000</li>
                    <li>20000</li>
                    <li>20000</li>
                    <li>20000</li>
                </div>
            </div>
            <div>
                <div>Total</div>
                <div>1200</div>
                <div></div>
            </div>
            <div>
                <div>Last Dues</div>
                <div>300</div>
                <div></div>
            </div>
            <div>
                <div>Grand Total</div>
                <div>1500</div>
                <div></div>
            </div>
        </div>
        <div className='bill-footer'>
            <span>Note: The Above amount must be paid within the 10th of every month</span>
        </div>
    </div>

}