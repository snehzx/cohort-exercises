let todoIndex = 1;
function addTodo() {
  const element = document.getElementById("todoInput");
  const todo = element.value;
  element.value = "";
  const todoDiv = document.createElement("div");
  todoDiv.setAttribute("id", "todo" + todoIndex);
  const todoSpan = document.createElement("span");
  todoSpan.innerHTML = todo;
  todoDiv.appendChild(todoSpan);
  const todoBtn = document.createElement("button");
  todoBtn.innerHTML = "detete";
  todoBtn.setAttribute("onclick", "deleteTodo(" + todoIndex + ")");
  todoDiv.appendChild(todoBtn);
  document.getElementById("todos").appendChild(todoDiv);
  todoIndex += 1;
}
function deleteTodo(index) {
  const divEl = document.getElementById("todo" + index);
  // divEl.parentElement.removeChild(divEl);
  document.getElementById("todos").removeChild(divEl);
}
