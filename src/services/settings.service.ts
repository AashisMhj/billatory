import { invoke } from "@tauri-apps/api";
import { SettingsType } from "@/types";

interface CreateSettingType {
    organizationName: string, 
    email: string | null, 
    location: string, 
    image: string, 
    phoneNo: string, 
    panNo: number,
}

export function getSettings(){
    return invoke('get_settings_data');
}

export function addSettings({organizationName, email, location, image, phoneNo, panNo}:CreateSettingType){
    return invoke('add_settings_data', {
        organizationName,
        location,
        email,
        image,
        phoneNo,
        panNo
    });

}

export function updateSettings({organizationName,email, location, image, phoneNo, panNo}:CreateSettingType){
    return invoke('update_settings', {
        organizationName,
        location,
        email,
        image,
        phoneNo,
        panNo
    })
}