const electron = require("electron");
remote = electron.remote
const bwipjs = require('bwip-js');
const encode = require('../utils/encode')


document.addEventListener("DOMContentLoaded",  async function(){

    let barCode = remote.getGlobal('barCode');
    let window = remote.getCurrentWindow()

   await bwipjs.toBuffer({ bcid:'code128',
    text:  barCode.code,    // Text to encode
    scaleY: 2,  
    scaleX: 0.5,             // 3x scaling factor
    height: 6,  
    width: 8,            // Bar height, in millimeters
    includetext: true,            // Show human-readable text
    textxalign:  'center'
    }, function (err, png) {
       
        let titDiv = document.getElementById('titl')
        let priDev = document.getElementById('price')
        titDiv.innerHTML = `title:`+barCode.title
        titDiv.style.cssText="font-size:10px"
        priDev.innerHTML = `price:`+barCode.price
        priDev.style.cssText="font-size:10px"
        if (err) {
          document.getElementById('output').textContent = err;
        } else {
          document.getElementById('myimg').src = 'data:image/png;base64,' +
                                                 png.toString('base64');
          document.getElementById('anchor').setAttribute( 'href','data:image/png;base64,' +
          png.toString('base64'));
        }
      });
     
});