import {invoke} from "@tauri-apps/api";


export function addFee(amount: number, chargeId: number, studentId: number, chargeTitle: string){
    return invoke('add_fee_data', { 
        chargeId,
        amount,
        studentId,
        chargeTitle
    });

}

export function updateFee(amount: number, chargeTitle: string, id: number){
    return invoke('update_fee_daa', {
        amount,
        chargeTitle, 
        id
    })
}

export function getFees(page:number, limit:number, student_id?:number, remaining=false,){
    return invoke('get_fee_data', {
        page,
        limit,
        remaining,
        studentId: student_id
    })
}

export function getFeeRowCount(remaining=false){
    return invoke('count_fees_row', {
        remaining
    });
}

export function getMonthlyFee(){
    return invoke('get_monthly_fee_data');
}

export function getMonthlyPayment(){
    return invoke('get_monthly_payment_data');
}