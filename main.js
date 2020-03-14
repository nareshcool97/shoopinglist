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
    mainWindow.maximize();
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
        event.sender.send('newProdCreated');
    }else{
     await callNotification('Product creation falied!', 'Please try again')
   }
   
 });

 ipcMain.on('newBillSubmit', async (event, args) => {
    const res = await knex('bills').insert(args)
    if(typeof res[0] == 'number'){
     await callNotification('New bill succesfully created! Invoice#', args.billNumber)
    }else{
     await callNotification('Product creation falied!', 'Please try again')
    }
     // event.sender.send('formSubmissionResults', results);
  });

    ipcMain.on('productsWindowLoaded', async event => {
        const result = await knex('products').select('productCode','title','description','salePrice','availableQuantity').orderBy('id', 'desc')
        await event.sender.send('productResultSent', (event, result));
    });

    ipcMain.on('editProd', async (event, prodCode) => {
        const editWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                additionalArguments: [prodCode]
            }
        });
        global.prodId= prodCode
        await editWindow.loadURL(`file://${__dirname}/`+ 'views/editProduct' +`.html`)
        // await event.sender.send('productDetSent', (event, result[0]));
    });

    ipcMain.on('showProd', async (event, prodCode) => {
        const showWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                additionalArguments: [prodCode]
            }
        });
        
        global.prodId= prodCode.substring(5,)
        await showWindow.loadURL(`file://${__dirname}/`+ 'views/showProduct' +`.html`)
        // await event.sender.send('productDetSent', (event, result[0]));
    });

    ipcMain.on("prodList", event => {
        const showWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true
            }
        });
        global.top = false
        showWindow.loadURL(`file://${__dirname}/`+ 'views/productsReport' +`.html`)
    })

    ipcMain.on("prodListTop", event => {
        const showWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true
            }
        });
        global.top = true
        showWindow.loadURL(`file://${__dirname}/`+ 'views/productsReport' +`.html`)
    })

    ipcMain.on("todaysBill", event => {
        const showWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true
            }
        });
        global.today = true
        showWindow.loadURL(`file://${__dirname}/`+ 'views/billReport' +`.html`)
    })

    ipcMain.on("dateBills", (event, dates) => {
        const showWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true
            }
        });
        global.today = null
        global.from = dates.from
        global.end = dates.end
        showWindow.loadURL(`file://${__dirname}/`+ 'views/billReport' +`.html`)
    })

    ipcMain.on('prodReportLoaded', async (event, top) => {
        let result = []
        if(top){
          result = await knex('products').select('id','productCode','title','description','productType','salePrice','purchasePrice','discount','runningStock','soldQuantity','availableQuantity').orderBy('soldQuantity', 'desc').limit(200)
        }else{ 
          result = await knex('products').select('id','productCode','title','description','productType','salePrice','purchasePrice','discount','runningStock','soldQuantity','availableQuantity').orderBy('title', 'inc')
        }
         await event.sender.send('productsResultSent', (event, result));
        // await event.sender.send('productDetSent', (event, result[0]));
    });

    ipcMain.on('billReportLoaded', async (event, data) => {
        let result = []
        if(data.today){
            var start = new Date();
            start.setHours(0,0,0,0);
            var end = new Date();
            end.setHours(23,59,59,999)
            result = await knex('bills').select('id','billNumber','billDate','customerName','customerPhone','billTotal','amountPaid','balanceAmount').whereBetween('bDate', [Date.parse(start), Date.parse(end)])
        }else{ 
            result = await knex('bills').select('id','billNumber','billDate','customerName','customerPhone','billTotal','amountPaid','balanceAmount').whereBetween('bDate', [data.from, data.end])
        }
    
         await event.sender.send('billReportSent', (event, result));
        // await event.sender.send('productDetSent', (event, result[0]));
    });



    ipcMain.on('editFormLoaded', async (event, prodCode) => {
        const result = await knex('products').select('*').where('productCode', prodCode)        
         await event.sender.send('productDetSent', (event, result[0]));
    });

    ipcMain.on('showProductWindowLoaded', async (event, prodCode) => {
        const result = await knex('products').select('*').where('productCode', prodCode)        
         await event.sender.send('productDetailsSent', (event, result[0]));
    });

    ipcMain.on('editProdSubmit', async (event, data) => {
        let prodCode = data['productCode']
        delete data['productCode'] 
        const result = await knex('products').where('productCode', prodCode).update(data)
        global.editedProd = true
        if(typeof result == 'number'){
            await event.sender.send('productEdited');
            await callNotification('Product successfully updated!')
        }else{
            await callNotification('Product NOT successfully updated! Try again!')
        }   
    });
    
    ipcMain.on('btnBarFun', async (event, prodCode) => {
        const result = await knex('products').select('*').where('productCode', prodCode.substring(4,))  
        barcodePdf(result[0])
    });

    ipcMain.on("printBill", async (evt, invoiceNum)=>{
        let bill = await knex('bills').select('*').where('billNumber', invoiceNum)
         printBill(bill[0])
    });

   
     function printBill(newBill){
        window_to_PDF = new BrowserWindow({show : true,  webPreferences: {
            nodeIntegration: true
        }});//to just open the browser in background
        global.billItems = newBill
 
        window_to_PDF.loadURL(`file://${__dirname}/`+ 'views/printBill' +`.html`); //give the file link you want to display

    }


    async function barcodePdf(data){
        window_to_PDF = new BrowserWindow({show : true,  webPreferences: {
            nodeIntegration: true
        }});//to just open the browser in background
        global.barCode = {
            title: data.title,
            code: data.productCode,
            price: data.salePrice
        }
       await window_to_PDF.loadURL(`file://${__dirname}/`+ 'views/barCode' +`.html`); //give the file link you want to display

    }



exports.openWindow = (filename) => {
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