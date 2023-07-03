import { invoke } from "@tauri-apps/api";
import { StudentType } from "@/types";


type CreateStudentType = Omit<StudentType, "id" | "is_active">
type UpdateStudentType = Omit<StudentType, "is_active">


export function getStudents(page:number, limit:number, class_id?: number){
    return invoke('get_student_data', {
        page, limit, classId: class_id
    })
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

export function getStudentRowCount(){
    return invoke('count_student_row')
}

export function getStudentFees(student_id:number){
    return invoke('get_student_fee_data', {
        studentId: student_id
    })

}

export function updateStudentStatus(student_id:number, checked:boolean){
    return invoke('change_student_status_data', {
        studentId: student_id,
        newStatus: checked
    })
}