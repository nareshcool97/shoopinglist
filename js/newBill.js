const electron = require("electron");
const ipcRender = electron.ipcRenderer;
const remote = electron.remote
const { loadPage } = require('../utils/commons')
const { knex } = require('./../server/server')
const autocomplete = require('autocompleter');


document.addEventListener("DOMContentLoaded",  function(){
    var homePage =  document.getElementById('home-btn')
    let invoice = document.getElementById('invoice')
    invoice.style.cssText="background-color:#F5F9A6"
    var window =  remote.getCurrentWindow({webPreferences: {
        nodeIntegration: true
    }})
     homePage.addEventListener('click',  () => {
    let pagePath = `file://${__dirname}/`+ 'mainWindow' +`.html`
     loadPage(window, pagePath)
    });

    var minlength = 3;
    const searchBarInputBox = document.getElementById('search-bar')
    autocomplete({
        input: searchBarInputBox,
        fetch: async (text, update) => {
            text = text.toLowerCase();
            // you can also use AJAX requests instead of preloaded data
            let suggestions = await knex('products').select('title', 'productCode').where('productCode', 'like', '%'+text+'%').orWhere('title', 'like', '%'+text+'%').map(item => item).filter(n => n.productCode.toLowerCase().startsWith(text) || n.title.toLowerCase().startsWith(text));
            suggestions = suggestions.map(item => ({ value: item.productCode, label: item.title }))
            update(suggestions);
        },
        onSelect:  async (item) => {
            event.preventDefault();
            searchBarInputBox.value = '';
            let prod =  await knex('products').select('productCode','title', 'salePrice','saleTax', 'discount').where('productCode', item.value)
            if(typeof prod !== 'undefined' && prod.length > 0){
                let resultEl = document.getElementById("inv-prod");
                let tr = document.createElement('tr');
                tr.id = prod[0].productCode
                tr.className = "prod-row"
                let td1 = document.createElement('td')
                td1.className = "sNo"
                prod[0].quantity = 1
                prod[0].value = prod[0].salePrice
                prod[0].discountedValue = prod[0].salePrice - prod[0].discount
                resultEl.appendChild(tr).appendChild(td1)
                Object.keys(prod[0]).forEach( key => {
                    let td= document.createElement('td')
                    
                    let input = document.createElement('input')
                    input.className = `${key} ${prod[0].productCode}`
              
                    input.value = prod[0][`${key}`]
                    if(['quantity', 'value', 'salePrice', 'saleTax', 'discount', 'discountedValue'].includes(key)){
                        input.type='number'
                        input.style.cssText = "text-align:right;size=50;-webkit-appearance: none;-moz-appearance: textfield;";
                    }else if('title' === key){
                        input.type="text"
                        input.size=100
                        input.style.cssText = "pointer-events: none;text-align:left; text-overflow:visible, size=60";
                    }else if('productCode' === key){
                        input.style.cssText = "pointer-events: none;text-align:left; text-overflow:visible";
                    }
   
                    resultEl.appendChild(tr).appendChild(td).appendChild(input)
                });

                let td2= document.createElement('td')
                let btn = document.createElement('button')
                btn.innerHTML = "remove"
                btn.className = "dlt-btn"
                btn.style.cssText="font-size:10"
                 resultEl.appendChild(tr).appendChild(td2).appendChild(btn)
                
            }else{
                alert('Something went wrong please redo!')
            }
            listItemsTrans();
            calBillTotal();
        }
    });

 
    function listItemsTrans(){
        let delBtn = document.getElementsByClassName('dlt-btn')
        let sNo = document.getElementsByClassName('sNo')

        for(var i = 0; i < delBtn.length; i++) {
            sNo[i].innerHTML = i+1
            calBillTotal();
            delBtn[i].addEventListener("click", event => {
                calBillTotal();
                event.currentTarget.parentElement.parentElement.remove()
            });
    
            document.addEventListener("keyup", event => {
                calBillTotal();
            }); 
            document.addEventListener("click", event => {
                calBillTotal();
            });  
        }
    }

    function calBillTotal(){
        let totalDiscountedBill = document.getElementById('bill-total')
        totalDiscountedBill.style.cssText = "text-align:right;size=50;font-size:25px;background-color:#F5F9A6;-webkit-appearance: none;-moz-appearance: textfield;";
        let qty = document.getElementsByClassName('quantity')
        let price = document.getElementsByClassName('salePrice')
        let tax = document.getElementsByClassName('saleTax')
        let disc = document.getElementsByClassName('discount')
        let val = document.getElementsByClassName('value')
        let discVal = document.getElementsByClassName('discountedValue')
        let billAmt = 0
        for(var i = 0; i < qty.length; i++) {

           let totVal = ((parseFloat(qty[i].value) || 0) * (parseFloat(price[i].value) || 0)) + (parseFloat(tax[i].value || 0 ))
           let disTot = (parseFloat(totVal) || 0 ) - (parseFloat(disc[i].value) || 0)
           
           val[i].value = parseFloat(totVal)
           discVal[i].value = parseFloat(disTot)
           billAmt += parseFloat(discVal[i].value);
        }
        totalDiscountedBill.value = billAmt
    }

    let saveBtn = document.getElementById('save-bill')

    saveBtn.addEventListener("click", async event => {
        calBillTotal();
        let prodCodes = []
        let prodJson = []
        let prods = document.getElementsByClassName('prod-row')
        for(var i = 0; i < prods.length; i++) {
            prodCodes.push(prods[i].id)
        }

        prodCodes.forEach( code => {
          let prodDet = document.getElementsByClassName(code)
          let prodItem = {}
          for(var j = 0; j < prodDet.length; j++) {
           prodItem = {
                productCode: prodDet[0].value,
                title: prodDet[1].value,
                salePrice: prodDet[2].value,
                saleTax: prodDet[3].value,
                discount: prodDet[4].value,
                quantity: prodDet[5].value,
                value: prodDet[6].value,
                discountedValue: prodDet[7].value
            }
          }
          prodJson.push(prodItem)
        })
        const invoiceNum = document.getElementById('invoice').value
        const dateInv = document.getElementById('inv-date').value
        const totBillValue = document.getElementById('bill-total').value
        const custName = document.getElementById('cust-name').value
        const custPhone = document.getElementById('cust-phone').value
        const custAddress = document.getElementById('cust-address').value
        const amtPaid = document.getElementById('amt-paid').value
       
         console.log({ billItems: prodJson })
        const bill = {
            billNumber: invoiceNum,
            userID: localStorage.getItem("userId"),
            shopName: "SV-MArt",
            address: "Maddur",
            billDate: dateInv,
            customerName: custName,
            customerAddress: custAddress,
            customerPhone: custPhone,
            billItems: JSON.stringify({ billItems: prodJson }),
            billTotal: totBillValue,
            amountPaid: amtPaid
         }

         await ipcRender.send('newBillSubmit', (event, bill));

    });
  

    
    

});