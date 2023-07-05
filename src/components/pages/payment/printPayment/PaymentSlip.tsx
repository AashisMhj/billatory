import './payment-slip.css';
import { forwardRef } from 'react';

interface Props{
    organization_name: string
    location: string
    pan_no: number 
    phone_no: string 
    payment_id: number 
    amount: number 
    student_id: number
}

export default forwardRef(function PaymentSlip({organization_name, location, pan_no, phone_no, payment_id, amount, student_id}:Props, ref){
    return (
        <div className='payment-container'>
            <div className='payment-title'>
                Holy Angel Sec. English School
            </div>
            <div className='payment-school-info'>
                <div>PAN No: 12345678</div>
                <div>Airport, Pokhara</div>
                <div>Phone No: 051-12345, 9876888</div>
            </div>
            <div className='payment-info'>
                <div>Receipt No: 12</div>
                <div>CASH RECEIPT</div>
                <div>
                    Date: 2020-12-12
                </div>
            </div>
            <div className='payment-content'>
                Recived with thanks from Susant Krilly as per the bill no 123 by Cash No the sum of rupees Twelve thousand On the account of
            </div>
            <div className='payment-footer'>
                <div>Rs <span>12000</span></div>
                <div>
                    Signature
                </div>
            </div>
        </div>
    )
})