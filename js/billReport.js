const electron = require("electron");
const ipcRender = electron.ipcRenderer;
const remote = electron.remote
if(typeof require !== 'undefined') XLSX = require('xlsx');
const saveAs = require('file-saver')


document.addEventListener("DOMContentLoaded",  function(){
    let today = remote.getGlobal('today');
    let from = remote.getGlobal('from');
    let end = remote.getGlobal('end');
    let data = {today: today, from: from, end: end}
    ipcRender.send("billReportLoaded", data)

    ipcRender.on("billReportSent", async (evt, result) => {
        let resultEl = document.getElementById("bill-rep");
        let billTot = document.getElementById("tot-bill");
        let billNo = document.getElementById("tot-no");
         let sum = 0
       await result.forEach(element => {
            let tr = document.createElement('tr');
            tr.style.cssText="border-top:0px"
            Object.keys(element).forEach( key => {
                let td= document.createElement('td')
                if(key === 'id'){
                    console.log(result.indexOf(element) + 1)
                    td.innerHTML = result.indexOf(element) + 1 
                }else if(key === 'billDate'){
                    td.innerHTML = new Date(element[key]).toString().substr(0,15)
                }else{
                    td.innerHTML = element[key] 
                }
                 if(key === 'billTotal') sum = sum + element[key] 
                resultEl.appendChild(tr).appendChild(td) 
            });
     
            // resultEl.insertAdjacentHTML('afterbegin', '<tr><td>One </td><td>Tow</td><td>Three</td></tr>');
        });
        billTot.innerHTML = sum
        console.log(result.length)
        billNo.innerHTML = result.length
        await saveExcel();
    });


  function saveExcel(){

    let resTab = document.getElementById("bill-rep")
    var wb = XLSX.utils.table_to_book(resTab, {sheet:"Sheet JS"});
    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
    function s2ab(s) {
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
    }
    $("#button-a").click(function(){
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'Billings.xlsx');
    });
 } 



});