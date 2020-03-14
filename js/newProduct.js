const electron = require("electron");
const ipcRenderer= electron.ipcRenderer;
const remote = electron.remote
const { loadPage } = require('../utils/commons')
document.addEventListener("DOMContentLoaded", async function(){
    var window = remote.getCurrentWindow({webPreferences: {
        nodeIntegration: true
      }});
    var newProd =  document.getElementById('prod-submit')
    var prodPage = document.getElementById('prod-index-btn')

   await prodPage.addEventListener('click',  () => {
     let pagePath = `file://${__dirname}/`+ 'products' +`.html`
     loadPage(window, pagePath)
    });

    var homePage = document.getElementById('home-btn')

    await homePage.addEventListener('click',  () => {
      let pagePath = `file://${__dirname}/`+ 'mainWindow' +`.html`
      loadPage(window, pagePath)
     });

    await newProd.addEventListener('click', async event => {
          
        var data = {
            productCode:  document.getElementById("prod-code").value,
            userID: localStorage.getItem("userId"),
            title:  document.getElementById("title").value,
            description:  document.getElementById("desc").value,
            productType: document.getElementById("prod-type").value,
            salePrice:  parseFloat(document.getElementById("sale-price").value),
            purchasePrice:  parseFloat(document.getElementById("purchase-price").value),
            discount:  parseFloat(document.getElementById("max-disc").value),
            saleTax:  parseFloat(document.getElementById("sale-tax").value),
            purchaseTax:  parseFloat(document.getElementById("pur-tax").value),
            runningStock: parseFloat(document.getElementById("run-stk").value),
            soldQuantity: parseFloat(document.getElementById("sold-qty").value),
            availableQuantity: parseFloat(document.getElementById("run-stk").value) - parseFloat(document.getElementById("sold-qty").value)
          }
          if(data.productCode && data.title && data.salePrice){
            await ipcRenderer.send('newProdSubmit', (event, data));
          }else{
              alert('product code, title , sale price to be filled!')
              event.preventDefault();
          }

        
    });

    ipcRenderer.on("newProdCreated", evt => {
      let pagePath = `file://${__dirname}/`+ 'newProduct' +`.html`
        loadPage(window, pagePath)

    });

});