import { invoke } from "@tauri-apps/api";
import { ChargesType } from "@/types";

type CreateChargeType = Omit<ChargesType, "id">
type UpdateChargeType = Omit<ChargesType, "is_regular" | "class_id" >

export function addChargeBulk(chargeTitle: string, amount: number, classes:Array<number>, isRegular: boolean){
    return invoke('add_charge_bulk_data', {
        chargeTitle,
        amount,
        classes,
        isRegular
    });
}

export function addCharge(chargeTitle: string, amount: number, classId: number){
    return invoke('add_charge_data', {
        chargeTitle,
        amount,
        classId
    })
}

export function getStudentOfCharge(chargeId:number){
    return invoke('get_charges_students_data', {
        chargeId
    });
}

export function getChargeDetail(chargeId:number){
    return invoke('get_charge_detail_data', {
        chargeId
    })
}

export function getCharges(page:number, limit:number){
    return invoke('get_charge_data', {
        page, limit
    })
}

/**
 * Function to get the all charges and status of checked of a student
 * @param charge_id 
 * @returns 
 */
export function getStudentCharges(studentId:number){
    return invoke('get_student_charges_data', {
        studentId
    });
}


export function updateCharge(data:UpdateChargeType){
    return invoke('update_charge_data', {
        chargeId: data.id,
        amount: data.amount,
        chargeTitle: data.charge_title
    })
}

/**
 * Function to apply charges directly
 * @param charge_id 
 * @returns 
 */
export function applyChargeAll(charge_id:number){
    return invoke('apply_charges_data', {
        chargeId: charge_id
    });
}

export function applyCharge(charge_id:number, student_ids: Array<number>, amount: number, chargeTitle: string){
    return invoke('apply_charges_student_data', {
        chargeId: charge_id,
        studentIds: student_ids,
        amount,
        chargeTitle
    })
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