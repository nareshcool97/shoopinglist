const electron = require("electron");
const ipcRender = electron.ipcRenderer;
const remote = electron.remote
if(typeof require !== 'undefined') XLSX = require('xlsx');
const saveAs = require('file-saver')


document.addEventListener("DOMContentLoaded",  function(){
    let top = remote.getGlobal('top');
    ipcRender.send("prodReportLoaded", top)
    ipcRender.on("productsResultSent", async (evt, result) => {
        let resultEl = document.getElementById("prods-list-tbl");
      
       await result.forEach(element => {
            let tr = document.createElement('tr');
            tr.className = element.productCode
            tr.style.cssText="border-top:0px"
            Object.keys(element).forEach( key => {
                let td= document.createElement('td')
                if(key==='id'){
                    td.innerHTML = result.indexOf(element) + 1 
                }else{
                    td.innerHTML = element[key]
                }
                resultEl.appendChild(tr).appendChild(td) 
            });
     
            // resultEl.insertAdjacentHTML('afterbegin', '<tr><td>One </td><td>Tow</td><td>Three</td></tr>');
        });
        await saveExcel();
    });


  function saveExcel(){

    let resTab = document.getElementById("prods-list-tbl")
    var wb = XLSX.utils.table_to_book(resTab, {sheet:"Sheet JS"});
    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
    function s2ab(s) {
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
    }
    $("#button-a").click(function(){
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'ProductsList.xlsx');
    });
 } 



});