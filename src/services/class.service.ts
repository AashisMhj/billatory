import { invoke } from "@tauri-apps/api";
import { StudentClassType } from "@/types";

type CreateClassType = Omit<StudentClassType, "id" | "created_at" | "updated_at">
export function addClass(data:CreateClassType){
    return invoke('add_class_data', {
        class: data.class
    });
}

export function getClasses(page:number, limit:number){
    return invoke('get_class_data', {
        page: page,
        limit: limit
    });
}

export function updateClass(data:StudentClassType){
    return invoke('update_class_data', {
        id: data.id,
        class: data.class
    });
}

export function getClassRowCount(){
    return invoke('count_class_rows');
}