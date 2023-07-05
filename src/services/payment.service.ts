import {invoke} from "@tauri-apps/api";
import { PaymentType } from "@/types";
export function addPayment({amount, student_id, remarks}:{amount:number, student_id:number, remarks?: string}){
    return invoke('add_payment_data', {
        amount,
        studentId: student_id,
        remarks
    });
}

export function getPayments(page:number, limit:number){
    return invoke('get_payment_data', {
        page,
        limit
    });
}

export function getPaymentDetail(id:number){
    return invoke('get_payment_detail_data', {
        id
    });
}

export function getPaymentRowCount(){
    return invoke('count_payment_rows');
}