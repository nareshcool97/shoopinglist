const electron = require("electron");
remote = electron.remote
const bwipjs = require('bwip-js');
const fs = require("fs")
const pdf = require('html-pdf');

document.addEventListener("DOMContentLoaded",  async function(){

    let barCode = remote.getGlobal('barCode');
    let window = remote.getCurrentWindow()
    
   await bwipjs.toBuffer({ bcid:'code128',
    text:  `${barCode.title}`+` `+`Rs. ${barCode.price}`,    // Text to encode
    scaleY:       2,  
    scaleX: 0.2,             // 3x scaling factor
    height:      7,              // Bar height, in millimeters
    includetext: true,            // Show human-readable text
    textxalign:  'center'
    }, function (err, png) {
       
        if (err) {
          document.getElementById('output').textContent = err;
        } else {
          document.getElementById('myimg').src = 'data:image/png;base64,' +
                                                 png.toString('base64');
          window.webContents.print({silent: true, printBackground:true});
        }
      });

        html = await fs.readFileSync(window.webContents, 'utf8');
        var options = { format: 'Letter' };
        
       await pdf.create(html, options).toFile(`./${data.title}.pdf`, function(err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
        });

     
});