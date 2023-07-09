import { ForwardedRef, forwardRef } from "react";
//
import { BillProps } from "@/types";
import './bill.css';

export default forwardRef(function Bill({ bill_items, previous_due, pan_no, phone_no, bill_no, total_sum, organization_name, month, location, student_name, roll_no, date, student_class }: BillProps, ref:ForwardedRef<HTMLDivElement>) {
    return <div className="bill-container" ref={ref}>
        <div className='bill-contact-info'>
            <div>Pan No: {pan_no}</div>
            <div>Contact No: {phone_no}</div>
        </div>
        <div className='school-name'>{organization_name}</div>
        <div className='school-address'>{location}</div>
        <div className='bill-info'>
            <div>Bill No: {bill_no}</div>
            <div className='bill-notice'>
                Notice Bill
            </div>
            <div>
                Date: {date}
            </div>
        </div>
        <div className='student-info'>
            <div>Name: {student_name}</div>
            <div>Class: {student_class}</div>
            <div>Month: {month}</div>
            <div>Roll No: {roll_no}</div>
        </div>
        <div className='bill'>
            <div className='bill-header'>
                <div>Particular</div>
                <div>Rs</div>
                <div>Ps</div>
            </div>
            <div className='bill-content'>
                <div>
                    {
                        bill_items.map((item) => <div key={item.id}>{item.title}</div>)
                    }
                </div>
                <div>
                    {
                        bill_items.map((item) => <div key={item.id}>{item.amount}</div>)
                    }
                </div>
                <div></div>
            </div>
            <div className="current-month-total">
                <div>Total</div>
                <div>{total_sum}</div>
                <div></div>
            </div>
            <div className="previous-due">
                <div>Last Dues</div>
                <div>{previous_due}</div>
                <div></div>
            </div>
            <div className="grand-total">
                <div>Grand Total</div>
                <div>{total_sum + previous_due}</div>
                <div></div>
            </div>
        </div>
        <div className='bill-footer'>
            <span>Note: The Above amount must be paid within the 10th of every month</span>
        </div>
    </div>

});