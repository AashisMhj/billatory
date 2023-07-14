import { useContext } from "react";
import Switch from "@mui/material/Switch";
import { ThemeContext } from "@/context/app-theme";

export default function ThemeToggler(){
    const {current_theme, setTheme} = useContext(ThemeContext);

    function changeHandler(_:React.ChangeEvent<HTMLInputElement>,value:boolean ){
        if(value){
            setTheme("light")
        }else{
            setTheme("dark");
        }
    }
    return (
        <Switch checked={current_theme === "light"} onChange={changeHandler} />
    )
}