const paths = {
    dashboard: `/dashboard/home`,
    // settings
    editSettings: `/dashboard/settings/edit`,
    viewLogs: `/dashboard/logs`,
    changePassword: `/dashboard/change-password`,
    // students
    studentsList: `/dashboard/students`,
    editStudent: (id: number) => `/dashboard/students/${id}/edit`,
    detailStudent: (id:number) => `/dashboard/students/${id}/info`,
    createStudent: `/dashboard/students/add`,
    studentFees: (id:number) => `/dashboard/students/${id}/fee`,
    studentBill: (id:number) => `/dashboard/students/${id}/bill`,
    studentCharges: (id:number) => `/dashboard/students/${id}/charges`,
    // class
    listClasses: `/dashboard/class`,
    // charges
    listCharges: `/dashboard/charges`,
    applyCharges: (id:number) => `/dashboard/charges/${id}/apply`,
    // fees
    listFees: `/dashboard/fees`,
    // payment
    listPayment: `/dashboard/payment`,
    addPayment: `/dashboard/payment/add`,
    printPayment: (id:number) =>  `/dashboard/payment/${id}/info`
}


export default paths;