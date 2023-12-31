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
    level?: number,
    icon?: (is_open: boolean) => ReactNode,
    breadcrumbs?: boolean,
    external?: boolean,
    disabled?: boolean,
    chip?: ChipProps,
}

export interface NavGroupType {
    id: string,
    title: string,
    type: string,
    children: Array<NavItemType>
}

export type log_types = "ERROR" | "INFO" | "WARN";

export interface LogType {
    id: number,
    type: log_types,
    description: string,
    time: string,
    title: string
}

export interface SettingsType {
    organization_name: string,
    pan_no: number,
    email?: string,
    image: string,
    location: string,
    phone_no: string,
    secondary_phone_no?: string,
    created_at?: string,
    updated_at?: string
}

export interface StudentClassType {
    class: string,
    id: number
}

export interface DataGraphType {
    amount: number,
    val: number
}

export interface ClassTableType {
    class: string,
    id: number,
    created_at: string,
    updated_at: string,
    male_count: number,
    female_count: number
} 

export interface ChargesType {
    id: number,
    class_id: number,
    charge_title: string,
    class?: string,
    amount: number,
    student_id?: number,
    is_regular: boolean
}

export interface StudentChargeType {
    id: number,
    charge_id: number,
    student_id?: number,
    charge_title: string,
    student_charge_id: number,
    amount?: number,
    class?: string,
    class_id?: number
}

export interface StudentMiniType {
    id: number,
    first_name: string,
    last_name: string,
    class_id: number,
}

export interface StudentMiniBillNo extends StudentMiniType{
    bill_no: number
} 

export interface StudentType {
    id: number,
    first_name: string,
    last_name: string,
    mid_name?: string,
    father_name: string,
    mother_name: string,
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

export interface FeesType {
    id: number,
    student_id: number,
    student_first_name?: string,
    student_mid_name?: string,
    student_last_name?: string,
    created_at: string,
    updated_at?: string,
    amount: number,
    year: number,
    month: number,
    title: string,
    class_id: number,
    class?: string,
    description?: string,
    charge_id: number,
    charge_title?: string,
    payment_id?: number
}

export interface PaymentType {
    id: number,
    created_at: string,
    amount: number,
    student_id: number,
    class_id: number,
    class?: string,
    payee: string,
    account_name: string,
    due_amount: number,
    receiver: string,
    bill_no?: number,
    student_first_name?: string,
    student_mid_name?: string,
    student_last_name?: string,
}


export interface ClassFilterType {
    limit: number
}

export interface StudentsTableFilterType {
    limit: number,
    show_active: boolean,
    class?: number
}

export interface ChargesFilterType {
    class_id?: number,
    limit: number
}

export interface FeesFilterType {
    limit: number,
    class_id?: number,
    charge?: number,
    student_id?: number,
    month?: number,
    year?: number,
}

export interface BillItems {
    title: string,
    amount: number,
    index: number
}

export interface BillProps {
    date: string,
    student_class: string,
    student_name: string,
    roll_no: number,
    bill_items: Array<FeesType>,
    previous_due: number,
    total_sum: number,
    month: string,
    bill_no: number,
    organization_name: string,
    location: string,
    pan_no: number,
    phone_no: string,
    image: string
}

export interface PaymentProps {
    bill_no?: number,
    organization_name: string
    location: string
    pan_no: number
    phone_no: string
    payment_id: number
    amount: number
    amount_words: string,
    current_date: string,
    payee: string,
    account_name: string,
    due_amount: number,
    receiver: string,
    image: string

}

export type ThemeTypes = "light" | "dark";