import { invoke } from "@tauri-apps/api";
import { SettingsType } from "@/types";

export function checkSettings(){

}

export function addSettings({organization_name, address, image, phone_no, pan_no}:SettingsType){
    return invoke('add-settings', {
        organization_name,
        address,
        image,
        phone_no,
        pan_no
    });

}

export function updateSettings({organization_name, address, image, phone_no, pan_no}:SettingsType){
    return invoke('update-settings', {
        organization_name,
        address,
        image,
        phone_no,
        pan_no
    })
}