import { createContext, useState, ReactNode } from "react";

export type SideBarContextValue = {
    is_open: boolean,
    openDrawer: (new_state: boolean) => void,
    openItems: Array<string>,
    changeOpenItems: (new_open_items: Array<string>) => void
}

export const SideBarContext = createContext<SideBarContextValue>({
    is_open: false,
    openDrawer: () => null,
    openItems: [],
    changeOpenItems: () => null
});

export const DrawerProvider = ({children}:{children:ReactNode})=>{
    const [is_open, setIsOpen] = useState<boolean>(false);
    const [openItems, setOpenItems] = useState<Array<string>>([]);

    const openDrawer = (new_state:boolean) =>{
        setIsOpen(new_state);
    }

    const changeOpenItems = (new_open_Items: Array<string>) =>{
        setOpenItems(new_open_Items);
    }

    return <SideBarContext.Provider value={{ is_open, openDrawer, openItems, changeOpenItems}}>
        {children}
    </SideBarContext.Provider>
}
