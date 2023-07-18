// icons
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AddIcon from '@mui/icons-material/Add';

// assets
import { NavGroupType } from '@/types'
import paths from '@/routes/path';



const dashboard: NavGroupType = {
    id: 'group-dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: paths.dashboard,
            icon: (is_open: boolean) => <DashboardCustomizeOutlinedIcon style={{ fontSize: is_open ? '1rem' : '1.25rem' }} />,
            breadcrumbs: false
        }
    ]
};

const student: NavGroupType = {
    id: 'student',
    title: 'Students',
    type: 'group',
    children: [
        {
            id: 's-classes',
            title: 'Classes',
            type: 'item',
            url: paths.listClasses,
            icon: (is_open: boolean) => <CorporateFareOutlinedIcon style={{ fontSize: is_open ? '1rem' : '1.25rem' }} />
        },
        {
            id: 's-students',
            title: 'Students',
            type: 'item',
            url: paths.studentsList,
            icon: (is_open: boolean) => <PersonOutlinedIcon style={{ fontSize: is_open ? '1rem' : '1.25rem' }} />,
        },
        {
            id: 's-students-add',
            title: 'Add Student',
            url: paths.createStudent,
            icon: (is_open) => <PersonAddAltIcon style={{fontSize: is_open ? '1rem': '1.25rem'}} />,
            type: 'item',
            level: 2
        }

    ]
};

const transaction: NavGroupType = {
    id: 'transaction',
    title: 'Transactions',
    type: 'group',
    children: [
        {
            id: 'f-charges',
            title: 'Fee Charges',
            type: 'item',
            url: paths.listCharges,
            icon: (is_open: boolean) => <AddCardOutlinedIcon style={{ fontSize: is_open ? '1rem' : '1.25rem' }} />,
        },
        {
            id: 'f-fees',
            title: 'Transactions',
            type: 'item',
            url: paths.listFees,
            icon: (is_open: boolean) => <FeedOutlinedIcon style={{ fontSize: is_open ? '1rem' : '1.25rem' }} />
        },

    ]
}

const fees: NavGroupType = {
    id: 'Fee',
    title: 'Fees',
    type: 'group',
    children: [
        {
            id: 'f-payments',
            title: 'Payment',
            type: 'item',
            url: paths.listPayment,
            icon: (is_open: boolean) => <MonetizationOnOutlinedIcon style={{ fontSize: is_open ? '1rem' : '1.25rem' }} />,
        },
        {
            id: 'f-payments',
            title: 'Payment',
            type: 'item',
            url: paths.listPayment,
            icon: (is_open: boolean) => <AddIcon style={{ fontSize: is_open ? '1rem' : '1.25rem' }} />,
            level: 2
        },

    ]
};


const menuItems: { items: Array<NavGroupType> } = {
    items: [dashboard, student, transaction, fees]
};

export default menuItems;
