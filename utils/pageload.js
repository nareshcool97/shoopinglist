exports.loadPage =  (window, pagepath) =>{
    window.loadURL(`file://${__dirname}/`+ pagepath +`.html`)
  } 