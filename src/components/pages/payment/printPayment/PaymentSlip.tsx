import './payment-slip.css';
import { ForwardedRef, forwardRef } from 'react';

interface Props{
    organization_name: string
    location: string
    pan_no: number 
    phone_no: string 
    payment_id: number 
    amount: number 
    amount_words: string,
    current_date: string,
    payee: string
}

export default forwardRef(function PaymentSlip({organization_name, location, pan_no, phone_no, payment_id, amount, current_date, amount_words, payee}:Props, ref:ForwardedRef<HTMLDivElement>){
    return (
        <div ref={ref} className='payment-container'>
            <div className='payment-title'>
                {organization_name}
            </div>
            <div className='payment-school-info'>
                <div>PAN No: {pan_no}</div>
                <div>{location}</div>
                <div>Phone No: {phone_no}</div>
            </div>
            <div className='payment-info'>
                <div>Receipt No: {payment_id}</div>
                <div>CASH RECEIPT</div>
                <div>
                    Date: {current_date}
                </div>
            </div>
            <div className='payment-content'>
                Received with thanks from  {payee}  as per the bill no 123 by Cash No the sum of rupees {amount_words} On the account of
            </div>
            <div className='payment-footer'>
                <div>Rs <span>{amount}</span></div>
                <div>
                    Signature
                </div>
            </div>
        </div>
    )
})