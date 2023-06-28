// TODO get the type without using typeof
import { ChipProps, SvgIconTypeMap } from "@mui/material"
import { IconProps } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ReactNode } from "react";

export type GenderType = "male" | "female";

export interface NavItemType {
    id: string,
    title: string,
    type: string,
    url: string,
    target?: boolean,
    icon?: (is_open:boolean) => ReactNode,
    breadcrumbs? :boolean,
    external?: boolean
    disabled? :boolean
    chip? : ChipProps
}

export interface NavGroupType{
    id: string,
    title: string,
    type: string,
    children: Array<NavItemType>
}

export type log_types = "backup" | "charge generate" | "system";

export interface LogType{
    type: log_types,
    description: string,
    time: string,
    title: string
}

export interface SettingsType{
    organization_name: string,
    pan_no: string,
    image: string,
    address: string,
    phone_no: string
}

export interface ClassType{
    class: string,
    id: number
}

export interface ChargesType{
    id: number,
    class_id: number,
    charge_title: string,
    class?: string,
    amount: number,
    is_regular: boolean
}

export interface StudentType{
    id: number,
    first_name: string,
    last_name: string,
    mid_name?: string,
    father_name: string,
    mother_name : string,
    class_id: number,
    class?: string,
    gender: GenderType,
    address?: string,
    date_of_birth?: string,
    phone_no?: string,
    email?: string
    created_at?: string
    updated_at?: string
    guardian_name?: string
    guardian_relation?: string,
    emergency_contact?: string,
    is_active: boolean,
}

export interface FeesType{
    id: number,
    student_id: number,
    first_name?: string,
    mid_name?: string,
    last_name?: string,
    created_at: string,
    updated_at?: string,
    amount: number,
    title: string,
    class_id: number,
    class?: string,
    description?: string,
    charge_id: number,
    charge?: string,
    payment_id?: number 
}

export interface PaymentType{
    id: number,
    created_at: string,
    amount: number,
    student_id: number,
    class_id: number,
    class?: string,
    student_first_name?: string,
    student_mid_name? : string,
    student_last_name? : string,
}


export interface ClassFilterType{
    limit: number
}

export interface StudentsTableFilterType{
    limit: number,
    class?: number
}

export interface ChargesFilterType{
    class?: number,
    limit: number
}

export interface FeesFilterType{
    class?: number,
    limit: number,
    charge?: number
}