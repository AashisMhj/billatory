import { invoke } from "@tauri-apps/api";
import { ChargesType } from "@/types";

type CreateChargeType = Omit<ChargesType, "id">
type UpdateChargeType = Omit<ChargesType, "is_regular" | "class_id" >

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

export function updateCharge(data:UpdateChargeType){
    return invoke('update_charge_data', {
        chargeId: data.id,
        amount: data.amount,
        chargeTitle: data.charge_title
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

export function addStudentCharge(studentId:number, chargeId:number){
    return invoke('add_student_charge_data', {
        studentId,
        chargeId
    })
}

export function removeStudentCharge(id:number){
    return invoke('remove_student_charge_data', {
        id
    })
}