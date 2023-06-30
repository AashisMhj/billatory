import {createContext, useState, ReactNode, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsType } from '@/types';
import  paths from '@/routes/path';
import LoadingPage from '@/pages/Loading';

export interface SettingsContextType {
    value: SettingsType,
    updateValue: (new_value:SettingsType) => void
}

const initial_settings = {
    organization_name: 'Holy Angel Secondary School',
    pan_no: '302720211',
    image: 'https://www.designevo.com/res/templates/thumb_small/branch-encircled-book-and-torch-shield.webp',
    address: 'Airport-9, Pokhara',
    phone_no: '051-538296, 9800000000'
};

export const SettingsContext = createContext<SettingsContextType>({
    value: initial_settings,
    updateValue: ()=>null
});


export const SettingsProvider = ({children}:{children:ReactNode}) =>{
    const [settings_value, setSettingsValue] = useState(initial_settings);
    const navigate = useNavigate();
    
    const updateValue = (new_value: SettingsType) =>{
        setSettingsValue(new_value);
    }


    return <SettingsContext.Provider value={{value: settings_value, updateValue}}>
        {children}
    </SettingsContext.Provider>
}