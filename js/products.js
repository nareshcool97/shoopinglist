const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;
const remote = electron.remote
const { loadPage } = require('../utils/commons')
const { knex } = require('./../server/server')

document.addEventListener("DOMContentLoaded", function(){
    var newProd =  document.getElementById('new-prod-btn')
    var window = remote.getCurrentWindow({webPreferences: {
      nodeIntegration: true
    }})
    var homePage = document.getElementById('home-btn')

     homePage.addEventListener('click',  async () => {
      let pagePath = `file://${__dirname}/`+ 'mainWindow' +`.html`
      await loadPage(window, pagePath)
     });

    newProd.addEventListener('click', async () => {
        await window.loadURL(`file://${__dirname}/`+ 'newProduct' +`.html`)
    });

    ipcRenderer.send("productsWindowLoaded")
    ipcRenderer.on("productResultSent", (evt, result) => {
        let resultEl = document.getElementById("prods-tbl");
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
            resultEl.appendChild(tr).appendChild(btn)

            editBtn= document.getElementById(element.productCode)
            editBtn.addEventListener('click', async (evt) =>{
                console.log(evt.toElement.id)
               await ipcRenderer.send("editProd", evt.toElement.id);
               await window.loadURL(`file://${__dirname}/`+ 'newProduct' +`.html`)
            })
            // resultEl.insertAdjacentHTML('afterbegin', '<tr><td>One </td><td>Tow</td><td>Three</td></tr>');
        });
    }); 
    


});