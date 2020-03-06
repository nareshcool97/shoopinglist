let ipcRenderer = require('electron').ipcRenderer;
console.log('before ren')

ipcRenderer.send('submitForm', event);
console.log('afyer ren')