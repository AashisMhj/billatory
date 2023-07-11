import {invoke} from "@tauri-apps/api";
import { PaymentType } from "@/types";
export function addPayment({amount, student_id, remarks, payee, account_name, nepali_month, nepali_year}:{amount:number, student_id:number, payee: string, account_name: string,nepali_month: number, nepali_year: number, remarks?: string}){
    return invoke('add_payment_data', {
        amount,
        studentId: student_id,
        payee,
        accountName: account_name,
        remarks,
        nepaliYear: nepali_year,
        nepaliMonth :nepali_month
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