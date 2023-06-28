import {invoke} from "@tauri-apps/api";
import { PaymentType } from "@/types";
export function addPayment({amount, student_id, remark}:{amount:number, student_id:number, remark?: string}){
    return invoke('add_payment_data', {
        amount,
        studentId: student_id,
        remark 
    });
}

export function getPayments(page:number, limit:number){
    return invoke('get_payment_data', {
        page,
        limit
    });
}

export function getPaymentRowCount(){
    return invoke('count_payment_rows');
}