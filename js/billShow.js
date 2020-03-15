const electron = require("electron");
const ipcRender = electron.ipcRenderer;
const remote = electron.remote



document.addEventListener("DOMContentLoaded",  function(){
    let billNumber = remote.getGlobal('billNo');

    ipcRender.send("billShowLoaded", billNumber)

    ipcRender.on("billDetSent", async (evt, result) => {
        console.log(result)
        let billNum = document.getElementById("bill-no")
        billNum.innerHTML = result.billNumber
        let billDate = document.getElementById("bill-date")
        billDate.innerHTML = result.billDate.toString().substr(0,21)
        let billTot = document.getElementById("bill-total")
        billTot.innerHTML = result.billTotal
        let billPay = document.getElementById("bill-paid")
        billPay.innerHTML = result.amountPaid
        let billBal = document.getElementById("bal-total")
        billBal.innerHTML = result.balanceAmount
        let tb = document.getElementById("prods")
        Object.values(JSON.parse(result.billItems)).forEach(element => {
            element.forEach(value => {

                let tr = document.createElement('tr')

                Object.keys(value).forEach(item => {
    
                        let td =document.createElement('td')
                        td.innerHTML =value[item]
                        tb.appendChild(tr).appendChild(td)
                })
                


            })
        })

        let printBtn = document.getElementById("print-bill")
        printBtn.addEventListener('click', event =>{
            ipcRender.send("printBill", result.billNumber)
        })
    });

});