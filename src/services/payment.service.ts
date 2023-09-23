import {invoke} from "@tauri-apps/api";
export function addPayment({amount, student_id, remarks, payee, account_name, due_amount, nepali_month, nepali_year, bill_no, receiver}:{amount:number, student_id:number, payee: string, account_name: string,nepali_month: number, nepali_year: number, due_amount: number, remarks?: string, bill_no: number | null, receiver:string}){
    return invoke('add_payment_data', {
        amount,
        studentId: student_id,
        payee,
        due_amount,
        accountName: account_name,
        remarks,
        dueAmount: due_amount,
        nepaliYear: nepali_year,
        nepaliMonth :nepali_month,
        billNo: bill_no,
        receiver
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