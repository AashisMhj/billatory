const paths = {
    dashboard: `/dashboard/`,
    // settings
    editSettings: `/dashboard/settings/edit`,
    // students
    studentsList: `/dashboard/students`,
    editStudent: (id: number) => `/dashboard/students/${id}/edit`,
    detailStudent: (id:number) => `/dashboard/students/${id}/info`,
    createStudent: `/dashboard/students/add`,
    studentFees: (id:number) => `/dashboard/students/${id}/fee`,
    studentBill: (id:number) => `/dashboard/students/${id}/bill`,
    // class
    listClasses: `/dashboard/class`,
    // charges
    listCharges: `/dashboard/charges`,
    // fees
    listFees: `/dashboard/fees`,
    // payment
    listPayment: `/dashboard/payment`,
    addPayment: `/dashboard/payment/add`,
    printPayment: (id:number) =>  `/dashboard/payment/${id}/info`
}


export default paths;