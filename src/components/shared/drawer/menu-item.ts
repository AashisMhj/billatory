// project import
import {
    LoginOutlined,
    ProfileOutlined,
    DashboardOutlined,
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    LoadingOutlined,
    ChromeOutlined,
    QuestionOutlined
} from '@ant-design/icons';
// ==============================|| MENU ITEMS ||============================== //
// assets
import {NavGroupType} from '@/types'

// icons
const icons = {
    LoginOutlined,
    ProfileOutlined,
    DashboardOutlined,
    FontSizeOutlined,
    BgColorsOutlined,
    BarcodeOutlined,
    AntDesignOutlined,
    LoadingOutlined,
    AppstoreAddOutlined,
    ChromeOutlined,
    QuestionOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const settings:NavGroupType = {
    id: 'settings',
    title: 'Settings',
    type: 'group',
    children: [
        {
            id: 's-settings',
            title: 'Edit Settings',
            type: 'item',
            url: '/settings',
            icon: icons.LoginOutlined,
            target: true
        },
    ]
};

const dashboard:NavGroupType = {
    id: 'group-dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.DashboardOutlined,
            breadcrumbs: false
        }
    ]
};

const student:NavGroupType = {
    id: 'student',
    title: 'Students',
    type: 'group',
    children: [
        {
            id: 's-students',
            title: 'Students',
            type: 'item',
            url: '/student',
            icon: icons.FontSizeOutlined
        },
        {
            id: 's-classes',
            title: 'Classes',
            type: 'item',
            url: '/color',
            icon: icons.BgColorsOutlined
        },
    ]
};

const fees:NavGroupType = {
    id: 'Fee',
    title: 'Fees',
    type: 'group',
    children: [
      {
        id: 'f-fees',
        title: 'Student Fees',
        type: 'item',
        url: '/fees',
        icon: icons.ChromeOutlined
      },
      {
        id: 'f-payments',
        title: 'Payment',
        type: 'item',
        url: '/payment',
        icon: icons.QuestionOutlined,
        external: true,
        target: true
      }
    ]
  };


const menuItems:{items: Array<NavGroupType>} = {
    items: [dashboard, fees, student, settings]
};

export default menuItems;
