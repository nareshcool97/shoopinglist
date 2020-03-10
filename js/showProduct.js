const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;
const remote = electron.remote
const { loadPage } = require('../utils/commons')
const { knex } = require('./../server/server')

document.addEventListener("DOMContentLoaded", async function(){
    let prodCode = remote.getGlobal('prodId');

    ipcRenderer.send("showProductWindowLoaded", prodCode)

    ipcRenderer.on("productDetailsSent", (evt, result) => {
        let resultEl = document.getElementById("prod-tbl");
        if(resultEl){
            Object.keys(result).forEach(key => {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.innerHTML=key
                let td1 = document.createElement('td');
                td1.innerHTML= `${result[key]}`
                resultEl.appendChild(tr).appendChild(td) 
                resultEl.appendChild(tr).appendChild(td1)
            });
        }
    })
});