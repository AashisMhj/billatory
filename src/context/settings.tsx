import {createContext, useState, ReactNode} from 'react';
import { SettingsType } from '@/types';

export interface SettingsContextType {
    value: SettingsType,
    updateValue: (new_value:SettingsType) => void
}

const initial_settings:SettingsType = {
    organization_name: '',
    pan_no: 0,
    image: '',
    location: '',
    secondary_phone_no: '',
    phone_no: ''
};

export const SettingsContext = createContext<SettingsContextType>({
    value: initial_settings,
    updateValue: ()=>null
});


export const SettingsProvider = ({children}:{children:ReactNode}) =>{
    const [settings_value, setSettingsValue] = useState(initial_settings);
    
    const updateValue = (new_value: SettingsType) =>{
        setSettingsValue(new_value);
    }


    return <SettingsContext.Provider value={{value: settings_value, updateValue}}>
        {children}
    </SettingsContext.Provider>
}