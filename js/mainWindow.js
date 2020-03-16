const electron = require("electron");
const ipc = electron.ipcRenderer;
const remote = electron.remote
document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("login-name").innerHTML = localStorage.getItem("userName");
    var logout =  document.getElementById('logout-btn')
    var prodPage = document.getElementById('prod-index-btn')
    var newBill = document.getElementById('make-bill-btn')
    var reportBtn = document.getElementById('reports-btn')
    var window = remote.getCurrentWindow({webPreferences: {
      nodeIntegration: true
    }})
    logout.addEventListener('click', async () => {
        await localStorage.clear()
        await window.loadURL(`file://${__dirname}/`+ 'login' +`.html`)
    });

    prodPage.addEventListener('click', async () => {
      await window.loadURL(`file://${__dirname}/`+ 'products' +`.html`)
    });

    newBill.addEventListener('click', async () => {
      await window.loadURL(`file://${__dirname}/`+ 'newBill' +`.html`)
    });

    reportBtn.addEventListener('click', async () => {
      await window.loadURL(`file://${__dirname}/`+ 'reports' +`.html`)
    });
    // ipc.send("mainWindowLoaded")
    // ipc.on("resultSent", function(evt, result){
    //     let resultEl = document.getElementById("result");
    //     for(var i = 0; i < result.length;i++){
    //         resultEl.innerHTML += "First Name: " + result[i].userName.toString() + "<br/>";
    //     }
    var toDoBtn = document.getElementById("todo-btn")
    toDoBtn.addEventListener('click', () => {
      let textTodo = document.getElementById("todo-in").value
    
      
      if(textTodo){
        let todo = {
          toDoNumber: Date.parse(new Date()),
          userId: localStorage.userId,
          textTodo: textTodo,
          done: false,
          createdAt: new Date()
          }

  
        ipc.send("todoAdd", todo)
        ipc.on("todoAdded",  event => {
          document.getElementById("todo-in").value = ''
          ipc.send("toDoListLoaded")
        });

      }else{
        alert("Please add some text to todo..")
      }
    });


    let todoListEle = document.getElementById("todo-list")
    if(todoListEle){
      toDo();
    }

    let complTodo = document.getElementById("compl-todo")
    if(complTodo){
      completedTodo()
    }

    function toDo(){
      ipc.send("toDoListLoaded")
      ipc.on("todoListRendered", (event, result) => {
        var todoList = document.getElementById("todo-list")
        todoList.innerHTML =''
        result.forEach(element => {
          
          let cardColDiv = document.createElement('div')
          cardColDiv.className="card-col"
          let card = document.createElement('div')
          card.className = "card"
          let textSpan = document.createElement('p')
         
          textSpan.innerHTML = element.textTodo

          let textSpan1 = document.createElement('span')
          textSpan1.innerHTML =  new Date(element.createdAt).toString().substr(0,21)
          textSpan1.style.cssText = "ver"
          let checkBtn = document.createElement('input')
          checkBtn.type='button'
          checkBtn.className = "button-add"
          checkBtn.id = element.toDoNumber

          let delBtn = document.createElement('input')
          delBtn.type='button'
          delBtn.className = "button-del"
          delBtn.id = element.toDoNumber+`-del`
          card.appendChild(textSpan1)
          card.appendChild(textSpan)
          card.appendChild(checkBtn)
          card.appendChild(delBtn)
          
          todoList.appendChild(cardColDiv).appendChild(card)

          delBtn.addEventListener('click', event => {
            delId = delBtn.id.substr(0,13)
            delBtn.parentElement.remove();
            ipc.send("deleteTodo", delId)
          })

          checkBtn.addEventListener('click', event => {
            todoId =  checkBtn.id
            checkBtn.parentElement.remove();
            ipc.send("upDateTodo", todoId)
            ipc.send("completedListLoaded")
          })

        });
      })
    }


    function completedTodo(){
      ipc.send("completedListLoaded")
      ipc.on("completdListRendered", (event, result) => {

        var compTodo = document.getElementById("compl-todo")
        compTodo.innerHTML =''
        console.log(result)
        result.forEach(element => {
          
          let cardColDiv = document.createElement('div')
          cardColDiv.className="card-col"
          let card = document.createElement('div')
          card.className = "card"
          let textSpan = document.createElement('p')

          textSpan.innerHTML = element.textTodo
          textSpan.style.cssText="text-decoration: line-through;"
          let textSpan1 = document.createElement('span')
          textSpan1.innerHTML =  new Date(element.updatedAt).toString().substr(0,21)
          let delBtn = document.createElement('input')
          delBtn.type='button'
          delBtn.className = "button-del"
          delBtn.id = element.toDoNumber+`-del`
          delBtn.style.cssText="float:right"
          card.appendChild(textSpan1)
          card.appendChild(textSpan)
          card.appendChild(delBtn)
          compTodo.appendChild(cardColDiv).appendChild(card)

          delBtn.addEventListener('click', event => {
            delId = delBtn.id.substr(0,13)
            delBtn.parentElement.remove();
            ipc.send("deleteTodo", delId)
          })


        });
      })
    }




});