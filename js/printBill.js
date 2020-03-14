const electron = require("electron");
remote = electron.remote

document.addEventListener("DOMContentLoaded",  async function(){

    bill = remote.getGlobal('billItems');
    let window = remote.getCurrentWindow()
    let tb = document.getElementById("bill-items")
    let billDisctot = document.getElementById("bill-tot")
    let paid = document.getElementById("paid")
    let bal = document.getElementById("bal")
    let billDate = document.getElementById("bill-date")
    billDisctot.innerText = bill.billTotal
    paid.innerText = bill.amountPaid
    bal.innerText = bill.balanceAmount
    billDate.innerHTML = bill.billDate.toString().slice(0, 21);
    Object.values(JSON.parse(bill.billItems)).forEach(element => {
     element.forEach(value => {
            let items = {
                title: value.title,
                qty: value.quantity,
                price: value.salePrice,
                disc: value.discount,
                discValue: value.discountedValue
            }
            let tr = document.createElement('tr')

            Object.keys(items).forEach(item => {

                    let td =document.createElement('td')
                    td.innerHTML =items[item]
                    tb.appendChild(tr).appendChild(td)
                })

            });
    
    });

    window.webContents.print({silent: true, printBackground:true});
     
});