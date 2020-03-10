const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;
const remote = electron.remote
const { loadPage } = require('../utils/commons')
const { knex } = require('./../server/server')

document.addEventListener("DOMContentLoaded", function(){
    var newProd =  document.getElementById('new-prod-btn')
    var reload =  document.getElementById('reload')
    var window = remote.getCurrentWindow({webPreferences: {
      nodeIntegration: true
    }})
    var homePage = document.getElementById('home-btn')

     homePage.addEventListener('click',  async () => {
      let pagePath = `file://${__dirname}/`+ 'mainWindow' +`.html`
      await loadPage(window, pagePath)
     });

     reload.addEventListener('click',  async () => {
        window.reload();
       });

    newProd.addEventListener('click', async () => {
        await window.loadURL(`file://${__dirname}/`+ 'newProduct' +`.html`)
    });

    ipcRenderer.send("productsWindowLoaded")
    ipcRenderer.on("productResultSent", (evt, result) => {
        let resultEl = document.getElementById("prods-tbl");
        if(resultEl){
        result.forEach(element => {
            let tr = document.createElement('tr');
            tr.className = element.productCode
            Object.values(element).forEach( value => {
                  
                let td= document.createElement('td')
                td.innerHTML = value
                resultEl.appendChild(tr).appendChild(td) 
            });
            btn=document.createElement('button');
            btn.innerHTML = "Edit"
            btn.id=element.productCode
            btn.style.cssText="font-size:12px;sixe:6px;padding:5px"
            resultEl.appendChild(tr).appendChild(btn)

            btnBar=document.createElement('button');
            btnBar.innerHTML = "Print |||"
            btnBar.style.cssText="font-size:12px;sixe:6px;padding:5px"
            btnBar.id='bar-'+element.productCode
            btnBar.className=element.productCode +'-'+ element.title+'-'+element.salePrice
            resultEl.appendChild(tr).appendChild(btnBar)

            showBtn=document.createElement('button');
            showBtn.innerHTML = "Show"
            showBtn.style.cssText="font-size:12px;sixe:6px;padding:5px"
            showBtn.id='show-'+element.productCode
            resultEl.appendChild(tr).appendChild(showBtn)

            showBtn= document.getElementById('show-'+element.productCode)
            showBtn.addEventListener('click', async (evt) =>{
                // await window.loadURL(`file://${__dirname}/`+ 'editProduct' +`.html`+`?id=${evt.toElement.id}`)
                await ipcRenderer.send("showProd", evt.toElement.id);
              
            })

            editBtn= document.getElementById(element.productCode)
            editBtn.addEventListener('click', async (evt) =>{
                // await window.loadURL(`file://${__dirname}/`+ 'editProduct' +`.html`+`?id=${evt.toElement.id}`)
                await ipcRenderer.send("editProd", evt.toElement.id);
              
            })

            btnBarFun= document.getElementById('bar-'+element.productCode)
            btnBarFun.addEventListener('click', async (evt) =>{
                // await window.loadURL(`file://${__dirname}/`+ 'editProduct' +`.html`+`?id=${evt.toElement.id}`)
                await ipcRenderer.send("btnBarFun", evt.toElement.id);
              
            })
            // resultEl.insertAdjacentHTML('afterbegin', '<tr><td>One </td><td>Tow</td><td>Three</td></tr>');
        });
     }
    });

    ipcRenderer.on("productEdited", () => {
        window.reload();
    })
    


});