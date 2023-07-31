import { invoke } from "@tauri-apps/api";

interface CreateSettingType {
    organizationName: string, 
    email: string | undefined, 
    location: string, 
    image: string, 
    phoneNo: string, 
    panNo: number,
    password: string,
    secondaryPhoneNo?: string
}

type UpdateSettingType = Omit<CreateSettingType, "password">

export function getSettings(){
    return invoke('get_settings_data');
}

export function addSettings({organizationName, email, location, image, phoneNo, panNo, password, secondaryPhoneNo }:CreateSettingType){
    return invoke('add_settings_data', {
        organizationName,
        location,
        email,
        image,
        phoneNo,
        panNo,
        password,
        secondaryPhoneNo
    });

}

export function updateSettings({organizationName,email, location, image, phoneNo, panNo,secondaryPhoneNo}:UpdateSettingType){
    return invoke('update_settings_data', {
        organizationName,
        location,
        email,
        image,
        phoneNo,
        panNo,
        secondaryPhoneNo
    })
}

export function changePassword(oldPassword:string, newPassword:string){
    return invoke('update_password_data', {
        oldPassword, newPassword
    })
}

export function verifyUser(password:string){
    return invoke('verify_user_data', {password})
}

export function backupData(){
    return invoke('backup_data');
}

export function getAppLog(){
    return invoke('get_log_data');
}

export function getBackUpFiles(){
    return invoke('get_backup_files_data')
}