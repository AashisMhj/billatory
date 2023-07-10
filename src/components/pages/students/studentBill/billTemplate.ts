import { BillProps } from "@/types";

export default function billFrame({ bill_items, previous_due, pan_no, phone_no, bill_no, total_sum, organization_name, month, location, student_name, roll_no, date, student_class }: BillProps){
    return `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Billator</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="card">
            <div class="card-body">
                <div class="container">
                <div class="row">
                    <div class="col-6 "> PAN No.: 302720211 </div>
                    <div class="col-6 text-end"> Ph No.: 061-538298 </div>
                </div>
                <div class="col-md-12">
                    <div class="text-center">
                    <h1 class="">${organization_name}</h1>
                    <p class="fw-bold">${location}</p>
                    <p class=" text-decoration-underline "> NOTICE BILL </p>
                    </div>
                </div>
                <div class="row ">
                    <div class="col-sm-8 col-lg-10 col-8">
                    <ul class="list-unstyled">
                        <li class="text-muted">BILL No.: </li>
                        <li class="text-muted">Name: </li>
                        <li class="text-muted">Month: </li>
                    </ul>
                    </div>
                    <div class="col-sm-4 col-lg-2 col-4">
                    <ul class="list-unstyled">
                        <li class="text-muted">Date: </li>
                        <li class="text-muted">Class:  </li>
                        <li class="text-muted">Roll No.: ${roll_no} </li>
                    </ul>
                    </div>
                </div>
                <div class=" justify-content-center">
                    <table class="table table-bordered " style='border:1px solid black;'>
                    <thead>
                        <tr>
                        <th class="col-9">Particulars</th>
                        <th class="col-2">Rs.</th>
                        <th class="col-1">Ps.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td class=" ">
                            <ul class="list-unstyled">
                            ${
                                bill_items.map(item => `<li>${item.title}</li>`).join(' ')
                            }
                            </ul>
                        <td>
                            <ul class="list-unstyled">
                            ${
                                bill_items.map(item => `<li>${item.amount}</li>`).join(' ')
                            }
                            </ul>
                        </td>
                        <td>
                            <ul class="list-unstyled">
                            ${
                                bill_items.map(item => `<li></li>`).join(' ')
                            }
                            </ul>
                        </td>
                        </tr>
                        <tr><td class="text-end">Total</td>
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
                <p class="">Note: Please show in this bill should be paid within the current month by 10th. of each month</p>
                </div>
            </div>
            </div>
        </body>
        </html>

    `
}