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

export type log_types = "ERROR" | "INFO" | "WARN";

export interface LogType{
    id: number,
    type: log_types,
    description: string,
    time: string,
    title: string
}

export interface SettingsType{
    organization_name: string,
    pan_no: number,
    email? : string,
    image: string,
    location: string,
    phone_no: string,
    created_at?: string,
    updated_at?: string
}

export interface StudentClassType{
    class: string,
    created_at: string,
    updated_at: string,
    id: number
}

export interface ChargesType{
    id: number,
    class_id: number,
    charge_title: string,
    class?: string,
    amount: number,
    student_id?: number,
    is_regular: boolean
}

export interface StudentChargeType{
    id: number,
    charge_id: number,
    student_id?: number,
    charge_title: string,
    student_charge_id: number,
    amount?: number,
    class?: string,
    class_id?: number
}

export interface StudentMiniType{
    id: number,
    first_name: string,
    last_name: string,
    class_id: number,
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
    roll_no: number,
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
    student_first_name?: string,
    student_mid_name?: string,
    student_last_name?: string,
    created_at: string,
    updated_at?: string,
    amount: number,
    title: string,
    class_id: number,
    class?: string,
    description?: string,
    charge_id: number,
    charge_title?: string,
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
    show_active: boolean,
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

export interface BillItems{
    title: string,
    amount: number,
    index: number
}

export interface BillProps{
    date: string,
    student_class: string,
    student_name: string,
    roll_no: number,
    bill_items: Array< FeesType>,
    previous_due: number,
    total_sum: number,
    month: string,
    bill_no: number,
    organization_name: string,
    location: string,
    pan_no: number,
    phone_no: string
}