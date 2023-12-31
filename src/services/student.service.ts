import { invoke } from "@tauri-apps/api";
import { StudentType } from "@/types";


type CreateStudentType = Omit<StudentType, "id" | "is_active">
type UpdateStudentType = Omit<StudentType, "is_active">


export function getStudents(page:number, limit:number, show_active:boolean, class_id?: number){
    return invoke('get_student_data', {
        page, limit, classId: class_id, isActive: show_active
    })
}

export function getAllActiveStudents(){
    return invoke('get_all_active_students_data');
}

export function addStudent(data:CreateStudentType){
    return invoke('add_student_data', {
        firstName: data.first_name,
        midName: data.mid_name,
        lastName: data.last_name,
        fatherName: data.father_name,
        address: data.address,
        dateOfBirth: data.date_of_birth,
        motherName: data.mother_name,
        phoneNo: data.phone_no,
        gender: data.gender,
        email: data.email,
        guardianName: data.guardian_name,
        guardianRelation: data.guardian_relation,
        emergencyContact: data.emergency_contact,
        classId: data.class_id,
        rollNo: data.roll_no,
        isActive: true

    })
}

export function updateStudent(data:UpdateStudentType){
    return invoke('update_student_data', {
        id: data.id,
        firstName: data.first_name,
        midName: data.mid_name,
        lastName: data.last_name,
        fatherName: data.father_name,
        address: data.address,
        motherName: data.mother_name,
        dateOfBirth: data.date_of_birth,
        phoneNo: data.phone_no,
        gender: data.gender,
        rollNo: data.roll_no,
        email: data.email,
        guardianName: data.guardian_name,
        guardianRelation: data.guardian_relation,
        emergencyContact: data.emergency_contact,
        classId: data.class_id,
        isActive: true

    })
}

export function getStudentDetail(id:number){
    return invoke('get_student_detail_data', {
        id
    })
}

export function getStudentRowCount(isActive: boolean, classId?: number){
    return invoke('count_student_row', {
        isActive,
        classId
    })
}

export function getStudentFees(student_id:number){
    return invoke('get_fee_data', {
        studentId: student_id,
        page: 1,
        limit: 1000,
    })

}

export function updateStudentStatus(student_id:number, checked:boolean){
    return invoke('change_student_status_data', {
        studentId: student_id,
        newStatus: checked
    })
}



export function getStudentPreviousDue(student_id:number, nepaliMonth:number, nepaliYear: number){
    return invoke('get_student_previous_due_data', {
        studentId: student_id,
        nepaliMonth,
        nepaliYear
    });
}

export function getStudentCurrentMonthStudentFees(student_id:number, nepaliMonth:number, nepaliYear: number){
    return invoke('get_current_month_student_fee_data', {
        studentId: student_id,
        nepaliMonth,
        nepaliYear
    })
}

export function bulkUpdateStudentClass(classId: number, studentIds: Array<number>){
    return invoke('bulk_update_student_class_data', {
        classId,
        studentIds
    })
}

export function bulkUpdateStudentStatus(newStatus: boolean, studentIds: Array<number>){
    return invoke('bulk_update_student_status_data', {
        newStatus,
        studentIds
    })
}

export function getStudentsWithBillNo(){
    return invoke('get_students_with_bill_no_data')
}