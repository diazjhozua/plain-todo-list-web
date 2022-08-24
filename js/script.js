// initialized all the variables needed
const inputNote = document.getElementById("inputNote");
const inputDesc = document.getElementById("inputDesc");
const todoList = document.getElementById("list");
const formNote = document.getElementById("formNote");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.getItem("tasks")) {
  tasks.map((task) => {
    createTask(task);
  });
}

// submit note form
formNote.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!formNote.checkValidity()) {
    formNote.classList.add("was-validated");
    inputNote.focus();
  } else {
    const task = {
      id: new Date().getTime(),
      note: inputNote.value,
      description: inputDesc.value,
      dateCreated: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
      isCompleted: false,
    };

    tasks.unshift(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    createTask(task);
    formNote.reset();
  }
});

// remove task - EL
todoList.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("remove-task") ||
    e.target.parentElement.classList.contains("remove-task")
  ) {
    const taskId = e.target.closest("li").id;
    removeTask(taskId);
  }
});

// update overall task - EL
todoList.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("edit-task") ||
    e.target.parentElement.classList.contains("edit-task")
  ) {
    const taskId = e.target.closest("li").id;
    updateTask(taskId);
  }
});

// update task status - EL
todoList.addEventListener("input", (e) => {
  const taskId = e.target.closest("li").id;
  updateTaskStatus(taskId, e.target);
});

// adding of task to DOM
function createTask(task) {
  const taskEl = document.createElement("li");
  taskEl.setAttribute("id", task.id);
  taskEl.classList.add("py-3");
  taskEl.classList.add("mb-3");
  taskEl.classList.add("list-group-item");
  taskEl.classList.add("task-item");
  const taskElMarkup = `
  <div class="row">
      <div class="col-1">
         <input
            class="form-check-input"
            type="checkbox"
            ${task.isCompleted ? "checked" : ""}
            value=""
            id="flexCheckDefault"
         />
      </div>
      <div class="col-7">
         <span class="fs-4"> ${task.note} </span>
         <p class="fs-6 fw-light">${task.description}</p>

         <p class="text-end fst-italic">${task.dateCreated}</p>
         <span></span>
      </div>
      <div class="col-3">
         <button class="btn btn-primary btn-sm m-1 edit-task">
            <i class="fa-solid fa-pen-to-square"></i>
         </button>
         <button class="btn btn-danger btn-sm m-1 remove-task">
            <i class="fa-solid fa-trash-can"></i>
         </button>
      </div>
   </div>
   `;
  taskEl.innerHTML = taskElMarkup;
  todoList.prepend(taskEl);
  //   countTasks();
}

// update task status
function updateTaskStatus(taskId, el) {
  console.log("taskId", taskId);
  const task = tasks.find((task) => task.id === parseInt(taskId));
  task.isCompleted = !task.isCompleted;

  localStorage.setItem("tasks", JSON.stringify(tasks));
  //   countTasks();
}

// remove task
function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));
  var deleteConfirmation = confirm(
    "Are you sure you want to delete this task permanently?"
  );
  if (deleteConfirmation == true) {
    console.log("tasks.length", tasks.length);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.getElementById(taskId).remove();
    //  countTasks();
  }
}
