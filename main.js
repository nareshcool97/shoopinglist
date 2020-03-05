// 'use strict';
// require('electron-reload')(__dirname);
 
const { app, BrowserWindow, Menu, ipcMain, Notification } = require("electron");
const url = require("url");
const path = require("path");
const { knex } = require('./server/server')
const mainWindowUrl = url.format({
    pathname: path.join(__dirname, "views/login.html"),
    protocol: "file:",
    slashes: true
});


function callNotification(title, message){
    let iconAddress = path.join(__dirname, '/icon.png');
    const notif={
          title: title,
          body: message,
          icon: iconAddress
        };
    new Notification(notif).show();
}

const onAppReady = () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(mainWindowUrl);
    mainWindow.on('closed', function(){
        app.quit();
    })
   
    mainWindow.once("ready-to-show", () => { mainWindow.show() })
   
	ipcMain.on("loginWindowLoaded", function () {
        let result = knex.select("*").from("users")
       
		result.then(function(rows){
			mainWindow.webContents.send("resultSent", rows);
		})
	});
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

};

//IPC all db actions

ipcMain.on('newProdSubmit', async (event, args) => {
   const res = await knex('products').insert(args)
   if(typeof res[0] == 'number'){
    await callNotification('New Product succesfully created!', args.title)
   }else{
    await callNotification('Product creation falied!', 'Please try again')
   }
    // event.sender.send('formSubmissionResults', results);
 });

 ipcMain.on('productsWindowLoaded', async event => {
    const result = await knex('products').select('productCode','title','description','salePrice','availableQuantity').orderBy('id', 'inc')
     await event.sender.send('productResultSent', (event, result));
});



exports.openWindow = (filename) => {
    console.log(`file://${__dirname}/`+ filename +`.html`)
    let win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadURL(`file://${__dirname}/`+ filename +`.html`)
}

const addItemUrl = url.format({
    pathname: path.join(__dirname, "./views/addItem.html"),
    protocol: "file:",
    slashes: true
});

function createAddItem(){
    let addItem = new BrowserWindow({
        width: 300,
        height: 400,
        title: 'Add items'
    });
    addItem.loadURL(addItemUrl);
    addItem.on('closed', function(){
        addItem = null
    })
}

function isMac(){
    process.platform == 'darwin'
}

if(isMac()){
    menuTemplate.unshift({
        label: 'Check'
    });
}

const menuTemplate = [
    {
        label: "MyBusiness",
        submenu: [
            {
            label: 'Add Item',
            click(){
                createAddItem();
            }
        },
        {
            label: "Quit",
            accelerator: isMac() ? 'Command+Q' : 'Ctrl+Q',
            click(){
              app.quit();
            }
        }]
    }
];

if(process.platform == 'darwin'){
    menuTemplate.unshift({label: 'Electron'});
}

if(process.env.NODE_ENV !== 'production'){
    menuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}

process.on('uncaughtException', error  => {
    console.log(error)
    // alert('Unknown error occurred! Please restart the application! '+error)
});

app.on("ready", onAppReady);