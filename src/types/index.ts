// TODO get the type without using typeof
import { ChromeOutlined } from "@ant-design/icons"
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon"
import { ChipProps } from "@mui/material"

export interface NavItemType {
    id: string,
    title: string,
    type: string,
    url: string,
    target?: boolean,
    icon?: typeof ChromeOutlined,
    // icon: React.ComponentType<AntdIconProps>
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

export interface SettingsType{
    organization_name: string,
    pan_no: string,
    image: string,
    address: string,
    phone_no: string
}

export interface StudentType{
    id: number,
    first_name: string,
    last_name: string,
    mid_name?: string,
    class_id: number,
    class?: string
}
