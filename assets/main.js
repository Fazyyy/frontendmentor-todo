document.addEventListener("DOMContentLoaded", () => {

  const themebtn = document.getElementById("theme-toggle");
  const body = document.getElementById("body");
  const themeimg = document.getElementById("theme-img");

  const input = document.getElementById("input");
  const itemsLeft =document.getElementById("itemsLeft");
  const todoListDOM = document.querySelector(".todos__list");
  const filters = document.querySelectorAll(".filter");


  //Theme switching functionality
  function toggleTheme() {
    body.classList.toggle("dark");
    body.classList.toggle("light");
    if(body.classList.contains("dark")) {
      themeimg.src = "./images/icon-sun.svg";
    } else {
      themeimg.src = "./images/icon-moon.svg";
    }
  };

  themebtn.addEventListener("click", toggleTheme);

  //Draggable elements
  let dragged;
  let id;
  let index;
  let indexDrop;
  let list;

    document.addEventListener("dragstart", ({target}) => {
        dragged = target;
        id = target.id;
        list = target.parentNode.children;
        for(let i = 0; i < list.length; i += 1) {
          if(list[i] === dragged){
            index = i;
          }
        }
    });

    document.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    document.addEventListener("drop", ({target}) => {
    if(target.className == "todo" && target.id !== id) {
        dragged.remove( dragged );
        for(let i = 0; i < list.length; i += 1) {
          if(list[i] === target){
            indexDrop = i;
          }
        }
        console.log(index, indexDrop);
        if(index > indexDrop) {
          target.before( dragged );
        } else {
        target.after( dragged );
        }
      }
    });

    //Add todo to list
    input.addEventListener("keyup", function(event){
      if(event.keyCode === 13) {
        event.preventDefault();
        addTodo(input.value);
        input.value = "";
      }
    });

    let todos = [];

    const addTodo = (item) => {
      if (item === "") return;

      const todo = {
        id: todos.length+1,
        name: item,
        completed: false
      };

      todos.push(todo);
      addToStorage(todos);
      itemsLeft.textContent = `${todos.length}`;
    };

    function addToStorage(todos) {
      localStorage.setItem("todos", JSON.stringify(todos));
      renderTodos(todos);
    }

    function renderTodos(todos) {
      todoListDOM.innerHTML = "";
      todos.forEach(function (item) {
        const checked = item.completed ? "checked" : null;
        const div = document.createElement("div");
        div.setAttribute("class", "todo");
        div.setAttribute("data-key", item.id);
        div.draggable = true;
        if (item.completed === true) {
          div.classList.add("checked");
        }
    
        div.addEventListener("dragstart", () => {
          div.classList.add("dragging");
        });
        div.addEventListener("dragend", () => {
          div.classList.remove("dragging");
        });
    
        div.innerHTML = `
          <img class="check ${checked}" src="./images/icon-check.svg" alt="" />
          <span>${item.name}</span>
          <img class="cross" src="./images/icon-cross.svg" alt="Remove item" />
           `;
        todoListDOM.append(div);
        itemsLeft.textContent = `${todos.length} items left`;
      });
    };

    function getFromLocalStorage() {
      const fromLocal = localStorage.getItem("todos");
      // if reference exists
      if (fromLocal) {
        // converts back to array and store it in todos array
        todos = JSON.parse(fromLocal);
    
        renderTodos(todos);
      }
    }
    
    getFromLocalStorage();

    function toggle(id) {
      todos.forEach(function (item) {
        if (item.id == id) {
          item.completed = !item.completed;
        }
      });
      addToStorage(todos);
    }

    function deleteTodo(id) {
      todos = todos.filter(function (item) {
        return item.id != id;
      });
      addToStorage(todos);
      itemsLeft.textContent = `${todos.length}`;
    }

    todoListDOM.addEventListener("click", function (event) {
    
      if (event.target.classList.contains("check")) {
        toggle(event.target.parentElement.getAttribute("data-key"));
      }
      if (event.target.classList.contains("cross")) {
        deleteTodo(event.target.parentElement.getAttribute("data-key"));
      }
    });

    function filterTodos(filter) {
      document
        .querySelectorAll(".active")
        .forEach((item) => item.classList.remove("active"));
      const option = filter.getAttribute("data-option");
      let newArr = [];
      if (option === "active") {
        filter.classList.add("active");
        newArr = todos.filter((todo) => todo.completed === false);
      } else if (option === "completed") {
        filter.classList.add("active");
        newArr = todos.filter((todo) => todo.completed !== false);
      } else {
        filter.classList.add("active");
        newArr = todos;
      }
      renderTodos(newArr);
      itemsLeft.textContent = `${newArr.length}`;
    }
    
    filters.forEach((filter) => {
      filter.addEventListener("click", () => {
        filterTodos(filter);
      });
    });
    
    const clear = document.querySelector(".clear");
    clear.addEventListener("click", clearCompletedTodos);
    
    function clearCompletedTodos() {
      todos = todos.filter((todo) => todo.completed !== true);
      addToStorage(todos);
    }
});