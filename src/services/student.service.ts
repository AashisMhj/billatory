import { invoke } from "@tauri-apps/api";
import { StudentType } from "@/types";


type CreateStudentType = Omit<StudentType, "id" | "is_active">
type UpdateStudentType = Omit<StudentType, "is_active">


export function getStudents(page:number, limit:number){
    return invoke('get_student_data', {
        page, limit
    })
}

export function addStudent(data:CreateStudentType){
    return invoke('add_student_data', {
        firstName: data.first_name,
        midName: data.mid_name,
        lastName: data.last_name,
        fatherName: data.father_name,
        address: data.address,
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
        phoneNo: data.phone_no,
        gender: data.gender,
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