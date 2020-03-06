const electron = require("electron");
const ipcRender = electron.ipcRenderer;
const remote = electron.remote
const { loadPage } = require('../utils/commons')
const { knex } = require('./../server/server')
const autocomplete = require('autocompleter');


document.addEventListener("DOMContentLoaded",  function(){
    var homePage =  document.getElementById('home-btn')
    var window =  remote.getCurrentWindow({webPreferences: {
        nodeIntegration: true
    }})
     homePage.addEventListener('click',  () => {
    let pagePath = `file://${__dirname}/`+ 'mainWindow' +`.html`
     loadPage(window, pagePath)
    });

    var minlength = 3;
    const searchBarInputBox = document.getElementById('search-bar')
    autocomplete({
        input: searchBarInputBox,
        fetch: async (text, update) => {
            text = text.toLowerCase();
            // you can also use AJAX requests instead of preloaded data
            let suggestions = await knex('products').select('title', 'productCode').where('productCode', 'like', '%'+text+'%').orWhere('title', 'like', '%'+text+'%').map(item => item).filter(n => n.productCode.toLowerCase().startsWith(text) || n.title.toLowerCase().startsWith(text));
            suggestions = suggestions.map(item => ({ value: item.productCode, label: item.title }))
            update(suggestions);
        },
        onSelect:  async (item) => {
             event.preventDefault();
            searchBarInputBox.value = '';
            let prod =  await knex('products').select('productCode','title', 'salePrice','saleTax', 'discount').where('productCode', item.value)
            if(typeof prod !== 'undefined' && prod.length > 0){
                let resultEl = document.getElementById("inv-prod");
                let tr = document.createElement('tr');
                tr.id = prod[0].productCode
                let td1= document.createElement('td')
          
                prod[0].quantity = 1
                prod[0].value = prod[0].salePrice
                prod[0].discountedValue = prod[0].salePrice - prod[0].discount
                resultEl.appendChild(tr).appendChild(td1)
                Object.values(prod[0]).forEach( value => {
                    console.log(prod[0])
                    let td= document.createElement('td')
                    let input = document.createElement('input')
                    input.value = value
                    resultEl.appendChild(tr).appendChild(td).appendChild(input)
                });

                let td2= document.createElement('td')
                let btn = document.createElement('button')
                btn.label = "delete"
                 resultEl.appendChild(tr).appendChild(td2).appendChild(btn)
                
            }else{
                alert('Something went wrong please redo!')
            }

        }
    });

});