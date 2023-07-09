import {invoke} from "@tauri-apps/api";
import { FeesType } from "@/types";

type CreateFeeType = Omit<FeesType, "id">

export function addFee(data:CreateFeeType){
    return invoke('add_fee_data', {
        
    });
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