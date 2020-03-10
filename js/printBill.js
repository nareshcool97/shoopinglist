const electron = require("electron");
remote = electron.remote

const pdf = require('html-pdf');

document.addEventListener("DOMContentLoaded",  async function(){

    bill = remote.getGlobal('billItems');
    let window = remote.getCurrentWindow()
    let tb = document.getElementById("bill-items")
    let billDisctot = document.getElementById("bill-tot")
    let billDate = document.getElementById("bill-date")
    billDisctot.innerText = bill.billTotal
    billDate.innerHTML = bill.billDate.toString().slice(0, 15);
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