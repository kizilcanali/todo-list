const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector("ul.list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners(){  //Tüm addEventListenerleri burada yazıcaz.
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosUI);
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}
function clearAllTodos(e){
    if(confirm("Are you sure to clear all ?")){
    //Arayüzü Temizleme
    //todoList.innerHTML= " " ; //Slow technique

    while(todoList.firstElementChild != null ){
        todoList.removeChild(todoList.firstElementChild);
    }
    localStorage.removeItem("todos");
    }
}
function filterTodos(e){

    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(filterValue) === -1){
            //Bulunamadı
            listItem.setAttribute("style","display:none !important");
        }
        else{
            listItem.setAttribute("style","display:block");
        }
    });
}
function deleteTodo(e){
    
    if(e.target.className === "fa fa-remove"){
        let el = e.target.parentElement.parentElement;
        el.remove();
        deleteTodosFromStorage(el.textContent);
        showAlert("success","Todo Silindi");
    };
};
function addTodo (e) {
    const newTodo = todoInput.value.trim(); //trim deletes the spaces.
    const control = getTodosFromStorage();
    let hasIt = false;
    control.forEach(function(check){
        if(check.indexOf(newTodo) != -1){
            hasIt = true;
        }
    });
    if(newTodo === ""){
        //showAlert(type,mesaj);
        showAlert("danger","Please enter a todo");
    }
    // else if(control.includes(newTodo)){     //another way
    //     showAlert("warning","You've already entered same todo!");
    // }
    else if(hasIt){
       
        showAlert("warning","You've already entered same todo!");
    }
    else{
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success","Todo added successfully.");
    }
    e.preventDefault();
};
function addTodoToUI(newTodo){
    //Created List item
    const listItem = document.createElement("li");
    //Created link
    const link = document.createElement("a");
    
    link.className ="delete-item";
    link.href ="#";
    link.innerHTML ="<i class ='fa fa-remove'></i>";

    listItem.className="list-group-item d-flex justify-content-between";
    //Add the text node
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    //Add todo to list.
    todoList.appendChild(listItem);

    todoInput.value ="";  //Clear the input spaces after addition.
};
function showAlert(type,message){
    const alert = document.createElement("div");
    alert.className =`alert alert-${type}`;
    alert.role="alert";
    alert.textContent=message;
    firstCardBody.appendChild(alert);

    //setTimeout 
    setTimeout(function(){
        alert.remove();
    },2000);
};
//Read todos from storage
function getTodosFromStorage(){
    let todos;

    if(localStorage.getItem("todos") === null){
        todos = [];
    }
    else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
};
function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage();
     todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));

};
function loadAllTodosUI(){
   let todos = getTodosFromStorage();
   todos.forEach(function(todo){
    addTodoToUI(todo);
   });
};
function deleteTodosFromStorage(delItem){

    let todos = getTodosFromStorage();
    todos.forEach(function(todo,index){
        if(todo===delItem){
           todos.splice(index,1); //Delete from array  (1 elem.)
        }
    });
    localStorage.setItem("todos",JSON.stringify(todos));
};