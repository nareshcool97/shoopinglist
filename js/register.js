
const electron = require("electron");
const ipc = electron.ipcRenderer;
const remote = electron.remote
const { knex } = require('../server/server')
const { encode } = require('../utils/encode.js')
const  currentWindow = remote.getCurrentWindow()
document.addEventListener("DOMContentLoaded", function(){
  var regLink = document.getElementById('loginlink');
  regLink.addEventListener('click', async event => {
   await loadPage(currentWindow, 'login')
  })
   var btn = document.getElementById('register');
       btn.addEventListener('click', async event => {
           var userName = document.getElementById('reg-username').value
           var password = encode(document.getElementById('reg-password').value)
           var email = document.getElementById('reg-email').value
              let res = await knex('users').insert({
               userName: userName,
               password: password,
               email: email
              })
            if(typeof res[0] == 'number'){
              await  loadPage(currentWindow, 'login')
              alert('Registered successfully!')
            }else{
              await  loadPage(currentWindow, 'register')
              alert('Registration not successfull! Please try again')
            }
       });
});


const loadPage =  (window, pagepath) =>{
  window.loadURL(`file://${__dirname}/`+ pagepath +`.html`)
} 



   
