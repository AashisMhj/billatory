import { invoke } from "@tauri-apps/api";
import { ChargesType } from "@/types";

type CreateChargeType = Omit<ChargesType, "id">

export function addCharge(chargeTitle: string, amount: number, classes:Array<number>, isRegular: boolean){
    return invoke('add_charge_data', {
        chargeTitle,
        amount,
        classes,
        isRegular
    });
}

export function getCharges(page:number, limit:number){
    return invoke('get_charge_data', {
        page, limit
    })
}

export function updateCharge(data:ChargesType){
    return invoke('update_charge_data', {
        data
    })
}

export function getChargeCount(){
    return invoke('get_charge_count');
}