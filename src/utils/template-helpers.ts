import { BillProps, PaymentProps } from "@/types";
import { addComma, padString } from "@/utils/helper-function";
import { MAX_BILL_ITEM } from "./constants";
import { convertToWords } from "@/utils/helper-function";

const Bill_Layout_HEAD = `
<head>
    <title>Bill Slip</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/bootstrap.min.css">
    <style type="text/css">
        @media print {
            body {
                font-size: 10px;
            }
            h1 {
                font-size: 16px;
            }
            .small-text{
                front-size: 4px;
            }

            ul.p-padding {
                padding: 0px 0px 0px 25px;
            }

            div.p-row {
                margin-top: -10px;
            }
            ul {
                margin: 0px;
            }
            .imagepack {
                background-position: center 40px;
                background-repeat: no-repeat;
                background-size: auto 60%;
            }
        }

        ul {
            margin: 0px;
        }
        .imagepack {
            background-position: center 40px;
            background-repeat: no-repeat;
            background-size: auto 60%;
        }
    </style>

</head>
`

export function getBillPageLayout(content: string) {
    return (`
    <!DOCTYPE html>
    <html lang="en">
    ${Bill_Layout_HEAD}
    <body>
        <div class="row">
        ${content}
        </div>
    </body>

    </html>
    `)
}

export function getBulkBillPageLayout() {
    return (`
    <!DOCTYPE html>
    <html lang="en">
    ${Bill_Layout_HEAD}
    <body>
        <div class="row" id="content">
        </div>
    </body>

    </html>
    `)
}

/**
 * @deprecated
 * @param param0 
 * @returns 
 */
export function billFrameV1({ bill_items, previous_due, pan_no, phone_no, bill_no, total_sum, organization_name, month, location, student_name, roll_no, date, student_class, image }: BillProps) {
    let m_bill_items = [...bill_items];
    const empty_array = Array.from({length: MAX_BILL_ITEM}, (_, k) => k);
    // if the no of items is greater than the specified then concat all the items to the last item
    if(m_bill_items.length > MAX_BILL_ITEM){
        const remainingItems = m_bill_items.slice(MAX_BILL_ITEM);
        m_bill_items.splice(MAX_BILL_ITEM, m_bill_items.length -MAX_BILL_ITEM);
        m_bill_items[MAX_BILL_ITEM] = {
            ...m_bill_items[MAX_BILL_ITEM],
            amount: remainingItems.reduce((prev, item)=>  prev + item.amount,0),
            charge_title: remainingItems.map(item => item.charge_title).join('+'),
        }
    }
    return `
    <div class="col-6">
            <div class="card logo">
                <div class="card-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-6 "> PAN No.: ${pan_no} </div>
                            <div class="col-6 text-end"> Ph No.: ${phone_no} </div>
                        </div>
                        <div class="col-md-12 logo" style="background-image: url(${image})">
                            <div class="text-center">
                                <h1 class="mb-0"> ${organization_name}</h1>
                                <p class="fw-bold my-0">${location}</p>
                                <p class="my-0 text-decoration-underline "> NOTICE BILL </p>
                            </div>
                        </div>
                        <div class="row p-row">
                            <div class="col-sm-7 col-lg-9 col-7">
                                <ul class="list-unstyled">
                                    <li class="text-muted">BILL No.: ${bill_no} </li>
                                    <li class="text-muted">Name: ${student_name} </li>
                                    <li class="text-muted">Month: ${month} </li>
                                </ul>
                            </div>
                            <div class="col-sm-5 col-lg-3 col-5 ">
                                <ul class="list-unstyled p-padding">
                                    <li class="text-muted">Date: ${date}</li>
                                    <li class="text-muted">Class: ${student_class} </li>
                                    <li class="text-muted">Roll No.:${roll_no} </li>
                                </ul>
                            </div>
                        </div>
                        <div class=" justify-content-center">
                            <table class="table table-bordered mb-0" style='border:1px solid black;'>
                                <thead>
                                    <tr>
                                        <th class="col-9">Particulars</th>
                                        <th class="col-2">Rs.</th>
                                        <th class="col-1">Ps.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <ul class="list-unstyled">
                                            ${empty_array.map((item, index) => `<li>${index < m_bill_items.length ?  m_bill_items[index].title : '&nbsp'}</li>`).join(' ')}
                                            </ul>
                                        <td>
                                            <ul class="list-unstyled">
                                            ${empty_array.map((item, index) => `<li>${index < m_bill_items.length ? addComma(m_bill_items[index].amount) : '&nbsp'}</li>`).join(' ')}
                                            </ul>
                                        </td>
                                        <td>
                                            <ul class="list-unstyled">
                                            ${empty_array.map(_ => `<li></li>`).join(' ')}
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-end">Total</td>
                                        <td>${total_sum}</td>
                                        <td></td>
                                    </tr>

                                    <tr>
                                        <td class="text-end">Last Dues</td>
                                        <td>${previous_due}</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td class="text-end">Grand Total</td>
                                        <td>${total_sum + previous_due}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="row">
                            <div class="col-2 text-dark">In Words</div>
                            <div class="col-10 text-dark"> ${convertToWords(total_sum + previous_due)} </div>
                        </div>
                        <div class="row">
                            <p class="col-9">Note: Amount shown in this bill should be paid within 10th of each month.</p>
                            <div class="col-3"> 
                                <div class="row align-items-end">
                                    <div class="col border-top-0">
                                        Signature
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

export function billFrame({ bill_items, previous_due, pan_no, phone_no, bill_no, total_sum, organization_name, month, location, student_name, roll_no, date, student_class, image }: BillProps) {
    let m_bill_items = [...bill_items];
    const empty_array = Array.from({length: MAX_BILL_ITEM}, (_, k) => k);
    // if the no of items is greater than the specified then concat all the items to the last item
    if(m_bill_items.length > MAX_BILL_ITEM){
        const remainingItems = m_bill_items.slice(MAX_BILL_ITEM);
        m_bill_items.splice(MAX_BILL_ITEM, m_bill_items.length -MAX_BILL_ITEM);
        m_bill_items[MAX_BILL_ITEM] = {
            ...m_bill_items[MAX_BILL_ITEM],
            amount: remainingItems.reduce((prev, item)=>  prev + item.amount,0),
            charge_title: remainingItems.map(item => item.charge_title).join('+'),
        }
    }
    return `
    <div class="col-6">
            <div class="card">
                <div class="card-body">
                    <div class="container">
                        <div class="jumbotron imagepack" style="background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.5)), url(${image});">
                            <div class="row">
                                <div class="col-6 "> PAN No.: ${pan_no} </div>
                                <div class="col-6 text-end"> Ph No.: ${phone_no} </div>
                            </div>
                            <div class="col-md-12">
                                <div class="text-center">
                                    <h1 class="mb-0">${organization_name}</h1>
                                    <p class="fw-bold my-0">${location}</p>
                                    <p class="my-0 text-decoration-underline "> NOTICE BILL </p>
                                </div>
                            </div>
                            <div class="row p-row">
                                <div class="col-7">
                                    <ul class="list-unstyled">
                                        <li class="text-muted">BILL No.: ${bill_no}</li>
                                        <li class="text-muted">Name: ${student_name}</li>
                                        <li class="text-muted">Month: ${month}</li>
                                    </ul>
                                </div>
                                <div class="col-5">
                                    <ul class="list-unstyled p-padding">
                                        <li class="text-muted">Date: ${date}</li>
                                        <li class="text-muted">Class: ${student_class}</li>
                                        <li class="text-muted">Roll No.: ${roll_no}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class=" justify-content-center">
                            <table class="table table-bordered mb-0" style='border:1px solid black;'>
                                <thead>
                                    <tr>
                                        <th class="col-9">Particulars</th>
                                        <th class="col-2">Rs.</th>
                                        <th class="col-1">Ps.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <ul class="list-unstyled">
                                            ${empty_array.map((item, index) => `<li>${index < m_bill_items.length ?  m_bill_items[index].title : '&nbsp'}</li>`).join(' ')}
                                            </ul>
                                        <td>
                                            <ul class="list-unstyled">
                                                ${empty_array.map((item, index) => `<li>${index < m_bill_items.length ? addComma(m_bill_items[index].amount) : '&nbsp'}</li>`).join(' ')}
                                            </ul>
                                        </td>
                                        <td>
                                            <ul class="list-unstyled">
                                                ${empty_array.map(_ => `<li></li>`).join(' ')}
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-end">Total</td>
                                        <td>${total_sum}</td>
                                        <td></td>
                                    </tr>

                                    <tr>
                                        <td class="text-end">Last Dues</td>
                                        <td>${previous_due}</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td class="text-end">Grand Total</td>
                                        <td>${total_sum + previous_due}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class=""><strong>Amount</strong>: ${convertToWords(total_sum + previous_due)}</div>
                        <div class="row align-items-center">
                            <div class="col-9 small-text">Note: Amount shown in Bill should be paid within 10th of each Month</div>
                            <div class="col-3 border-top">
                                <span class="small-text">Signature </signature>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

/**
 * @deprecated
 * @param param0 
 * @returns 
 */
export function paymentFrame1({organization_name, location, pan_no, phone_no, due_amount, payment_id, amount, current_date, amount_words, payee, account_name}:PaymentProps) {
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <title>Bootstrap 5 Example</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="/bootstrap.min.css" rel="stylesheet">
    <style>
        tr td {
            padding: 0 !important;
            margin: 0 !important;
        }

        .vbottom {
            align-items: flex-end;
        }

        div {
            font-size: 14px;
        }

        .mg {
            margin-top: -1rem;
        }

        @media print {
            tr td {
                padding: 0 !important;
                margin: 0 !important;
            }

            .vbottom {
                align-items: flex-end;
            }

            div {
                font-size: 14px;
            }

            .mg {
                margin-top: -1rem;
            }
        }
    </style>
</head>

<body>
    <div class="container-fluid m-1 p-1 mb-3 border border-dark">
        <div class="container-fluid">
            <div class="row d-flex">
                <div class="col">
                    PAN No.: ${pan_no}
                </div>
                <div class="col text-end">
                    Ph No.: ${phone_no}
                </div>
            </div>
            <div class="text-center mg">
                <h4 class=" ">${organization_name}</h4>
                <p class="fw-bold m-0">${location}</p>
            </div>

            <div class="row ">
                <div class="col-3 col-md-3 d-flex justify-content-end fs-3 text-primary vbottom">RECEIPT</div>
                <div class="col-4 col-md-4  d-flex justify-content-end vbottom">Date: ${current_date}</div>
                <div class="col-5 col-md-5 d-flex justify-content-end vbottom">Receipt No.: ___${payment_id}___</div>
            </div>
            <div class="row pb-1">
                <div class="col-3 col-lg-2 d-flex justify-content-end fw-bold vbottom">Received From</div>
                <div class="col d-flex justify-content-start vbottom">${payee}</div>
                <div class="col  d-flex justify-content-end">
                    <div class="row d-flex justify-content-end">
                        <div class="col d-flex vbottom">Amount <div>
                                <div class="col d-flex border border-dark px-2 vbottom">Rs ${amount} </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="row pb-1">
                <div class="col-3  col-lg-2 d-flex justify-content-end ">Amount</div>
                <div class="col d-flex justify-content-start">${convertToWords(amount)}</div>
                <div class="col-2 d-flex justify-content-end">rupees</div>

            </div>
            <div class="row pb-1">
                <div class="col-3  col-lg-2 d-flex justify-content-end fw-bold">For Payment Of</div>
                <div class="col d-flex justify-content-start">___________________________________________________</div>
            </div>

            <div class="row pb-1">
                <div class="col-3  col-lg-2 d-flex justify-content-end ">From</div>
                <div class="col d-flex justify-content-start">________ to ______ rupees</div>
                <div class="col-5 col-md-5 d-flex justify-content-end">
                    <div class="row">
                        <div class="col d-flex justify-content-end">Paid By</div>
                        <div class="col justify-content-end">
                            <div class="form-check ">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">Cash

                            </div>
                            <div class="form-check ">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                                Cheque_____________
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">Money
                                Order

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row pb-1">
            <div class="col-3  col-lg-2 d-flex justify-content-end fw-bold">Received By</div>
            <div class="col d-flex justify-content-start">___________________________________________________</div>

            <div class="col-3 d-flex justify-content-end">
                <table class="table">
                    <tr>
                        <td>Amount Due</td>
                        <td>${due_amount}</td>
                    </tr>
                    <tr class="border-bottom border-dark">
                        <td>This Payment</td>
                        <td>${amount}</td>
                    </tr>
                    <tfoot>
                        <tr>
                            <td>Balance due</td>
                            <td>${due_amount - amount}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</body>

</html>
    `
}


export function paymentFrame({organization_name, location, pan_no, phone_no, due_amount, payment_id, amount, current_date, amount_words, payee, account_name, receiver, image}:PaymentProps) {
    return`
    <!DOCTYPE html>
<html lang="en">

<head>
    <title>Payment Slip</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/bootstrap.min.css">
    <style>
        tr td {
            padding: 0 !important;
            margin: 0 !important;
        }

        .vbottom {
            align-items: flex-end;
        }

        div {
            font-size: 14px;
        }

        .mg {
            margin-top: -1rem;
        }
        .imagepack {
            background-position: center 40px;
            background-repeat: no-repeat;
            background-size: auto 60%;
        }
        @media {
            .imagepack {
                background-position: center 40px;
                background-repeat: no-repeat;
                background-size: auto 60%;
            }
        }
    </style>
</head>

<body>
    <div class="container-fluid m-1 p-1 mb-3 border border-dark imagepack" style="background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.5)), url(${image});">
        <div class="container-fluid">
            <div class="row d-flex">
                <div class="col">
                    PAN No.: ${pan_no}
                </div>
                <div class="col text-end">
                    Ph No.: ${phone_no}
                </div>
            </div>
            <div class="text-center mg " >
                <h4 class=" ">${organization_name}</h4>
                <p class="fw-bold m-0">${location}</p>
            </div>

            <div class="row ">
                <div class="col-3 col-md-3 d-flex justify-content-end fs-3 text-primary vbottom">RECEIPT</div>
                <div class="col-4 col-md-4  d-flex justify-content-end vbottom">Date: ${current_date}</div>
                <div class="col-5 col-md-5 d-flex justify-content-end vbottom">Receipt No.: ${padString(""+payment_id, 10, "&nbsp;")}</div>
            </div>
            <div class="row pb-1">
                <div class="col-3 col-lg-2 d-flex justify-content-end fw-bold vbottom">Received From</div>
                <div class="col d-flex justify-content-start vbottom"> <span class="border-bottom border-dashed">${padString(payee, 30, "&nbsp;")}</span></div>
                <div class="col  d-flex justify-content-end">
                    <div class="row d-flex justify-content-end">
                        <div class="col d-flex vbottom">Amount <div>
                                <div class="col d-flex border border-dark px-2 vbottom">Rs ${amount} </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="row pb-1">
                <div class="col-3  col-lg-2 d-flex justify-content-end ">Amount</div>
                <div class="col d-flex justify-content-start"> ${ amount_words}</div>
                <div class="col-2 d-flex justify-content-end">rupees</div>
            </div>
            <div class="row pb-1">
                <div class="col-3  col-lg-2 d-flex justify-content-end fw-bold">For Payment Of</div>
                <div class="col d-flex justify-content-start"> <span class="border-bottom border-dashed"> ${padString(account_name, 30, "&nbsp;")} </span> </div>
            </div>

            <div class="row pb-1">
                <div class="col-5 col-md-5 d-flex justify-content-end">
                    <div class="row">
                        <div class="col d-flex justify-content-end">Paid By</div>
                        <div class="col justify-content-end">
                            <div class="form-check ">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"> Cash
                            </div>
                            <div class="form-check ">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"> Cheque 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row pb-1">
            <div class="col-3  col-lg-2 d-flex justify-content-end fw-bold">
                <div class="row">
                    <div class="col-12 text-end">
                        Received By
                    </div>
                    <div class="col-12 text-end border-top">
                        Signature
                    </div>
                </div>
            </div>
            <div class="col d-flex justify-content-start">
                ${receiver}
            </div>
            <div class="col-3 d-flex justify-content-end">
                <table class="table">
                    <tr>
                        <td>Amount Due</td>
                        <td>${due_amount}</td>
                    </tr>
                    <tr class="border-bottom border-dark">
                        <td>This Payment</td>
                        <td>${amount}</td>
                    </tr>
                    <tfoot>
                        <tr>
                            <td>Balance due</td>
                            <td>${due_amount - amount}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</body>

</html>
    `
}



