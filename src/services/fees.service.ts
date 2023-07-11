import {invoke} from "@tauri-apps/api";


export function addFee(amount: number, chargeId: number, studentId: number, chargeTitle: string, nepaliYear: number, nepaliMonth: number){
    return invoke('add_fee_data', { 
        chargeId,
        amount,
        studentId,
        chargeTitle,
        nepaliYear, 
        nepaliMonth
    });

}

export function updateFee(amount: number, chargeTitle: string, id: number){
    return invoke('update_fee_daa', {
        amount,
        chargeTitle, 
        id
    })
}

export function getFees(page:number, limit:number, classId?: number,  student_id?:number, chargeId?: number, year?:number, month?: number, ){
    return invoke('get_fee_data', {
        page,
        limit,
        classId,
        studentId: student_id,
        chargeId,
        year,
        month
    })
}

export function getFeeRowCount(classId?: number, studentId?: number, chargeId?: number, year?: number, month?: number){
    return invoke('count_fees_row', {
        classId, studentId, chargeId, year, month
    });
}

export function getMonthlyFee(nepaliMonth: number, nepaliYear: number){
    return invoke('get_monthly_fee_data', {
        nepaliMonth, nepaliYear
    });
}

export function getMonthlyPayment(nepaliMonth: number, nepaliYear: number){
    return invoke('get_monthly_payment_data', {
        nepaliMonth, nepaliYear
    });
}