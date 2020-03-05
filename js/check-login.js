const electron = require("electron");
const remote = electron.remote
const { knex } = require('../server/server')
const { encode } = require('../utils/encode.js')
const currentWindow = remote.getCurrentWindow()

document.addEventListener("DOMContentLoaded", function(){
    var regLink = document.getElementById('reglink');
    regLink.addEventListener('click', async event => {
     await loadPage(currentWindow, 'register')
    })
   var btn = document.getElementById('login');
       btn.addEventListener('click', async event => {
           var userName = document.getElementById('username').value
           var password = encode(document.getElementById('password').value)
           let res = await knex('users').where({
               userName: userName,
               password: password
              }).select('*')
            if(res != null && res.length!= 0 && res[0].userName == userName && res[0].password == password){
             await  localStorage.setItem('userName', userName);
             await  localStorage.setItem('userId', res[0].id);
             await loadPage(currentWindow, 'mainWindow')
            }else{
             alert('Login not successful! please try again!')
            }
       });
});

const loadPage =  (window, pagepath) =>{
    window.loadURL(`file://${__dirname}/`+ pagepath +`.html`)
  } 
  