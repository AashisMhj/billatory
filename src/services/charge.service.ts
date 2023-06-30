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

export function getStudentCharges(student_id:number){
    return invoke('get_student_charges_data', {
        studentId: student_id
    });
}

export function updateCharge(data:ChargesType){
    return invoke('update_charge_data', {
        data
    })
}

export function applyCharge(charge_id:number){
    return invoke('apply_charges_data', {
        chargeId: charge_id
    });
}

export function getChargeCount(){
    return invoke('count_charges_row');
}