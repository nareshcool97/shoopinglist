const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;
const remote = electron.remote
const { loadPage } = require('../utils/commons')
const { knex } = require('./../server/server')

document.addEventListener("DOMContentLoaded", async function(){
    let prodCode = remote.getGlobal('prodId');

    ipcRenderer.send("editFormLoaded", prodCode)

    ipcRenderer.on("productDetSent", async (evt, result) => {
        document.getElementById("prod-code").value = result.productCode
        document.getElementById("title").value = result.title
        document.getElementById("prod-type").value = result.productType
        document.getElementById("desc").value = result.description
        document.getElementById("sale-price").value = result.salePrice
        document.getElementById("purchase-price").value = result.purchasePrice
        document.getElementById("max-disc").value = result.discount
        document.getElementById("sale-tax").value = result.saleTax
        document.getElementById("pur-tax").value = result.purchaseTax
        document.getElementById("packing-price").value = result.packingPrice
        document.getElementById("offer").value = result.offerDiscount
        document.getElementById("run-stk").value = result.runningStock
        document.getElementById("sold-qty").value = result.soldQuantity
    
    })
    
    var window = remote.getCurrentWindow({webPreferences: {
        nodeIntegration: true
      }});
    var editProd =  document.getElementById('prod-edit')

    await editProd.addEventListener('click', async event => {  
        var data = {
            productCode: document.getElementById("prod-code").value,
            userID: localStorage.getItem("userId"),
            title:  document.getElementById("title").value,
            description:  document.getElementById("desc").value,
            salePrice:  parseFloat(document.getElementById("sale-price").value),
            purchasePrice:  parseFloat(document.getElementById("purchase-price").value),
            discount:  parseFloat(document.getElementById("max-disc").value),
            saleTax:  parseFloat(document.getElementById("sale-tax").value),
            purchaseTax:  parseFloat(document.getElementById("pur-tax").value),
            packingPrice:  parseFloat(document.getElementById("packing-price").value),
            offerDiscount:  parseFloat(document.getElementById("offer").value),
            runningStock: parseFloat(document.getElementById("run-stk").value),
            soldQuantity: parseFloat(document.getElementById("sold-qty").value),
            availableQuantity: parseFloat(document.getElementById("run-stk").value) - parseFloat(document.getElementById("sold-qty").value)
          }
        await ipcRenderer.send('editProdSubmit', (event, data));
        await ipcRenderer.on("productEdited", () => {
            window.close();
            window.on('closed', function(){
                window.opener.reload();
            })
        })
    });

});

