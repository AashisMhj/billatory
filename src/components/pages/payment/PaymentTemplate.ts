interface Props{
    organization_name: string
    location: string
    pan_no: number 
    phone_no: string 
    payment_id: number 
    amount: number 
    amount_words: string,
    current_date: string,
    payee: string,
    account_name: string
}

export default function paymentFrame({organization_name, location, pan_no, phone_no, payment_id, amount, current_date, amount_words, payee, account_name}:Props) {
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
                    Received with thanks from ${payee}. as per the bill no ______ by Cash/Draft/Cheque No. _____________ the sum of rupees ${amount_words} On the account of ${account_name}
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