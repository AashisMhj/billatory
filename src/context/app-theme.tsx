import {ReactNode, createContext, useState} from "react";
import { ThemeTypes } from "@/types";


export type ThemeContextValue = {
    current_theme: ThemeTypes,
    setTheme: (new_theme: ThemeTypes) => void
}

export const ThemeContext = createContext<ThemeContextValue>({
    current_theme: "light",
    setTheme: () => null,
})

export const AppThemeProvider = ({children}:{children: ReactNode}) =>{
    const [current_theme, setCurrentTheme] = useState<ThemeTypes>("light");

    function setTheme(new_theme: ThemeTypes){
        setCurrentTheme(new_theme);
    }

    return <ThemeContext.Provider value={{ current_theme, setTheme}}>
        {children}
    </ThemeContext.Provider>
}