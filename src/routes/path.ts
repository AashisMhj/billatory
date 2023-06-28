const paths = {
    dashboard: `/dashboard/`,
    // settings
    editSettings: `/dashboard/settings/edit`,
    // students
    studentsList: `/dashboard/students`,
    editStudent: (id: number) => `/dashboard/students/${id}/edit`,
    createStudent: `/dashboard/students/add`,
    studentDetail: (id:number) => `/dashboard/student/${id}`,
    // class
    listClasses: `/dashboard/class`,
    // charges
    listCharges: `/dashboard/charges`,
    // fees
    listFees: `/dashboard/fees`,
    // payment
    listPayment: `/dashboard/payment`,
    addPayment: `/dashboard/payment/add`,
}


export default paths;