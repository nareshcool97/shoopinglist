const electron = require("electron");
const ipcRender = electron.ipcRenderer;
const remote = electron.remote
const { loadPage } = require('../utils/commons')

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

    ipcRender.send("productsWindowLoaded")
    ipcRender.on("productResultSent", (evt, result) => {
        let resultEl = document.getElementById("prods-tbl");
        result.forEach(element => {
            let tr = document.createElement('tr');
            Object.values(element).forEach( value => {
                  
                let td= document.createElement('td')
                td.innerHTML = value
                resultEl.appendChild(tr).appendChild(td) 
            });
                     
            // resultEl.insertAdjacentHTML('afterbegin', '<tr><td>One </td><td>Tow</td><td>Three</td></tr>');
        });
    });

});