const electron = require("electron");
const ipcRender = electron.ipcRenderer;
const remote = electron.remote
const { loadPage } = require('../utils/commons')
const { knex } = require('./../server/server')

document.addEventListener("DOMContentLoaded",  function(){
    var window =  remote.getCurrentWindow({webPreferences: {
        nodeIntegration: true
    }})
    var homePage =  document.getElementById('home-btn')
   if(homePage){
    homePage.addEventListener('click',  () => {
        let pagePath = `file://${__dirname}/`+ 'mainWindow' +`.html`
         loadPage(window, pagePath)
    });
    }

    var prodListBtn =  document.getElementById('prod-list')
    if(prodListBtn){
    prodListBtn.addEventListener('click',  () => {
        ipcRender.send("prodList")
    });
    }

    var prodList10Btn =  document.getElementById('prod-list-top')
    if(prodList10Btn){
     prodList10Btn.addEventListener('click',  () => {
        ipcRender.send("prodListTop")
    });
    }


});