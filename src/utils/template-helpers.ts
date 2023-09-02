import { BillProps, PaymentProps } from "@/types";
import { addComma } from "@/utils/helper-function";
import { MAX_BILL_ITEM } from "./constants";
import { convertToWords } from "@/utils/helper-function";

const Bill_Layout_HEAD = `
<head>
    <title>Bootstrap Example</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="/bootstrap.min.css" rel="stylesheet" >
    <style type="text/css">
        .logo{
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
        }
        @media print {
            body {
                font-size: 10px;
            }

            h1 {
                font-size: 20px;
            }

            ul.p-padding {
                padding: 0px 0px 0px 25px;
            }

            div.p-row {
                margin-top: -10px;
            }
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
                                            ${empty_array.map((item, index) => `<li>${index < m_bill_items.length ?  m_bill_items[index].title : '&nbsp'}</li>`).join(' ')
        }
                                            </ul>
                                        <td>
                                            <ul class="list-unstyled">
                                            ${empty_array.map((item, index) => `<li>${index < m_bill_items.length ? addComma(m_bill_items[index].amount) : '&nbsp'}</li>`).join(' ')
        }
                                            </ul>
                                        </td>
                                        <td>
                                            <ul class="list-unstyled">
                                            ${empty_array.map(_ => `<li></li>`).join(' ')
        }
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


export function paymentFrameV1({organization_name, location, pan_no, phone_no, payment_id, amount, current_date, amount_words, payee, account_name}:PaymentProps) {
    return `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Billator</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="./Diphylleia-Regular.ttf">
            <link rel="stylesheet" href="./Sofia-Regular.ttf">

        </head>
        <body>
            <div class="card ">
            <div class="card-body">
                <div class="container">
                <h1 class="text-center" style="font-family: Sofia, sans-serif;">${organization_name}</h1>
                
                <div class="row ">
                    <div class="col-3 fs-6"> PAN No.: ${pan_no} </div>
                    <div class="fs-5 col-4 text-end fw-bold pt-2" style="font-family: Sofia, sans-serif;"> ${location} </div>
                    <div class="col-5 text-end">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M38.3 241.3L15.1 200.6c-9.2-16.2-8.4-36.5 4.5-50C61.4 106.8 144.7 48 256 48s194.6 58.8 236.4 102.6c12.9 13.5 13.7 33.8 4.5 50l-23.1 40.7c-7.5 13.2-23.3 19.3-37.8 14.6l-81.1-26.6c-13.1-4.3-22-16.6-22-30.4V144c-49.6-18.1-104-18.1-153.6 0v54.8c0 13.8-8.9 26.1-22 30.4L76.1 255.8c-14.5 4.7-30.3-1.4-37.8-14.6zM32 336c0-8.8 7.2-16 16-16H80c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V336zm0 96c0-8.8 7.2-16 16-16H80c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V432zM144 320h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H144c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H240c-8.8 0-16-7.2-16-16V336zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H336c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H432c-8.8 0-16-7.2-16-16V336zm16 80h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H432c-8.8 0-16-7.2-16-16V432c0-8.8 7.2-16 16-16zM128 432c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H144c-8.8 0-16-7.2-16-16V432z"/></svg>
                    <span>${phone_no} </span>
                    </div>
                </div>
                <div class="row fs-5">
                    <div class="col-3 mt-2 fs-6"> Receipt No.: ${payment_id}  </div>
                    <div class="col-4 fs-5 text-end fw-bold "><span class="p-1 border border-dark">CASH RECEIPT </span> </div>
                    <div class="col-5 fs-6 text-end mt-2">
                    Date: ${current_date} 
                    </div>
                </div>
                <div class=" justify-content-center">
                    
                </div>
                </br>
                <p class="fs-5 fw-bold" style="font-family:Diphylleia">
                    Received with thanks from ${payee}  </br> as per the bill no ______ by Cash/Draft/Cheque No. _____________ </br>the sum of rupees ${amount_words} </br>On the account of ${account_name}
                </p>
            
                
                <div class ="row pt-4">
                    <div class="col-3">
                        <table class="table table-bordered   " style='border:1px solid black;border-radius:5px;'>
                        <tr>
                            <th class='col-1'>Rs.</th>
                            <th class="col-2"> ${amount}</th>
                        </tr>
                        </table>
                        
                    </div>
                    <div class="col-7 ">
                    
                    </div>
                    <div class="col-2 text-end">
                        _____________</br>
                    <span class= "text-center">Signature</span>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </body>
        </html>
    `
}

export function paymentFrame({organization_name, location, pan_no, phone_no, due_amount, payment_id, amount, current_date, amount_words, payee, account_name}:PaymentProps) {
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <title>Bootstrap 5 Example</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>
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
        @print media{
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
        }
    </style>
</head>

<body>
    <div class="conainer-fluid m-1 p-1 mb-3 border border-dark">
        <div class="container-fluid">
            <div class="row pb-3">
                <div class="col col-md-4 d-flex justify-content-start fs-3 text-primary vbottom">RECEIPT</div>
                <div class="col-4 col-md-4  d-flex justify-content-end vbottom">Date: ${current_date}</div>
                <div class="col-4 col-md-4 d-flex justify-content-end vbottom">Receipt No.: ${payment_id}</div>
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
                <div class="col d-flex justify-content-start">________${amount}_______</div>
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
                        <td>Amount Amt</td>
                        <td>${amount}</td>
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


