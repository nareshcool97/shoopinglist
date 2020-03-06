const electron = require("electron");
const ipc = electron.ipcRenderer;
const remote = electron.remote
document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("login-name").innerHTML = localStorage.getItem("userName");
    var logout =  document.getElementById('logout-btn')
    var prodPage = document.getElementById('prod-index-btn')
    var makeBill = document.getElementById('make-bill-btn')
    var window = remote.getCurrentWindow({webPreferences: {
      nodeIntegration: true
    }})
    logout.addEventListener('click', async () => {
        await localStorage.clear()
        await window.loadURL(`file://${__dirname}/`+ 'login' +`.html`)
    });

    prodPage.addEventListener('click', async () => {
      await window.loadURL(`file://${__dirname}/`+ 'products' +`.html`)
    });

    makeBill.addEventListener('click', async () => {
      await window.loadURL(`file://${__dirname}/`+ 'newBill' +`.html`)
    });
    // ipc.send("mainWindowLoaded")
    // ipc.on("resultSent", function(evt, result){
    //     let resultEl = document.getElementById("result");
    //     for(var i = 0; i < result.length;i++){
    //         resultEl.innerHTML += "First Name: " + result[i].userName.toString() + "<br/>";
    //     }
    
});