import {invoke} from "@tauri-apps/api";
import { FeesType } from "@/types";

type CreateFeeType = Omit<FeesType, "id">

export function addFee(data:CreateFeeType){
    return invoke('add_fee_data', {
        
    });
}

export function getFees(page:number, limit:number){
    return invoke('get_fee_data', {
        page,
        limit,
        remaining: false
    })
}

export function getFeeRowCount(remaining=false){
    return invoke('count_fees_row', {
        remaining
    });
}