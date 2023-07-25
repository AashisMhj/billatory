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

export function getFeeDetail(id:number){
    return invoke('get_fee_detail_data', {
        id
    });
}

export function updateFeeAmount(id:number, amount:number){
    return invoke('update_fee_amount_data', {
        id, amount
    })
}


export function getYearlyFeeStats(){
    return invoke('get_yearly_fee_stats_data');
}

export function getYearlyPaymentStats(){
    return invoke('get_yearly_payment_stats_data');
}

export function getMonthlyFeeStats(nepaliYear: number){
    return invoke('get_monthly_fee_stats_data', {
        nepaliYear
    });
}


export function getMonthlyPaymentStats(nepaliYear: number){
    return invoke('get_monthly_payment_stats_data', { nepaliYear})
}

export function disableChargeData(chargeId: number){
    return invoke('disable_fee_data', {chargeId})
}

export function getBillCount(){
    return invoke('get_bill_count_data');
}

export function addBill(studentId: number, prevAmount: number, rollNo: number, studentClass: String, particular: String){
    return invoke('add_bill_data', {
        studentId, prevAmount, rollNo, studentClass, particular
    })
}