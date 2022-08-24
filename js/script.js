// initialized all the variables needed
const inputNote = document.getElementById("inputNote");
const inputDesc = document.getElementById("inputDesc");
const todoList = document.getElementById("list");
const formNote = document.getElementById("formNote");
const noTaskMessage = document.getElementById("noTaskMessage");

// progress bar
const completedProgressBar = document.getElementById("completedProgressBar");
const pendingProgressBar = document.getElementById("pendingProgressBar");

var editableID = 0;
var isEditing = false;

// init loading of tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (tasks.length != 0) {
  noTaskMessage.classList.add("d-none");
  countTasks();
}

// sort tasks date to descending
if (localStorage.getItem("tasks")) {
  // sort by date

  tasks.sort((a, b) => {
    if (new Date(a.dateCreated).getTime() > new Date(b.dateCreated).getTime()) {
      return 1;
    } else if (
      new Date(a.dateCreated).getTime() < new Date(b.dateCreated).getTime()
    ) {
      return -1;
    } else {
      return 0;
    }
  });

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
    // validation passed
    formNote.classList.remove("was-validated");
    if (!isEditing) {
      const task = {
        id: new Date().getTime(),
        note: inputNote.value,
        description: inputDesc.value,
        dateCreated: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
        }),
        isCompleted: false,
      };

      tasks.unshift(task);
      createTask(task);
      vanillaToast.success(
        "The task has been created successfully! I hope you finished this soon",
        {
          duration: 2000,
          fadeDuration: 180,
        }
      );
    } else {
      // if editing
      const task = tasks.find((task) => task.id == editableID);
      if (task) {
        task.note = inputNote.value;
        task.description = inputDesc.value;
      }

      vanillaToast.success(
        "The task has been updated successfully! I hope you finished this soon",
        {
          duration: 2000,
          fadeDuration: 180,
        }
      );

      updateTaskDOM(task);
    }

    //reset
    editableID = 0;
    isEditing = false;

    localStorage.setItem("tasks", JSON.stringify(tasks));

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
    updateTask(taskId, e.target);
  }
});

// update task status - EL
todoList.addEventListener("input", (e) => {
  const taskId = e.target.closest("li").id;
  updateTaskStatus(taskId, e.target);
});

// adding of task to DOM
function createTask(task) {
  noTaskMessage.classList.add("d-none");

  const taskEl = document.createElement("li");
  taskEl.setAttribute("id", task.id);
  if (task.isCompleted) {
    taskEl.classList.add("complete");
  }
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
      <div class="col-8">
         <p class="fs-5"> ${task.note} </p>
         <p class="fs-6 fw-light text-wrap">${task.description}</p>

         <p class="text-end fst-italic text-wrap">${task.dateCreated}</p>
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
  countTasks();
}

// update task status
function updateTaskStatus(taskId, el) {
  const task = tasks.find((task) => task.id === parseInt(taskId));
  task.isCompleted = !task.isCompleted;

  if (task.isCompleted) {
    vanillaToast.success("Yehey Congrats Mr. Productive Person :)", {
      duration: 2000,
      fadeDuration: 180,
    });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  editableID = task.id;
  updateTaskDOM(task);
  countTasks();
}

// update task
function updateTask(taskId, el) {
  const task = tasks.find((task) => task.id === parseInt(taskId));
  inputNote.value = task.note;
  inputDesc.value = task.description;
  editableID = taskId;
  isEditing = true;
  window.scrollTo(0, 0);
  inputNote.focus();
}

// remove task
function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));
  var deleteConfirmation = confirm(
    "Are you sure you want to delete this task permanently?"
  );
  if (deleteConfirmation == true) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.getElementById(taskId).remove();

    if (tasks.length == 0) {
      noTaskMessage.classList.remove("d-none");
    }

    countTasks();
  }

  vanillaToast.info("The task has been deleted successfully!", {
    duration: 2000,
    fadeDuration: 180,
  });
}

function updateTaskDOM(task) {
  if (task.isCompleted) {
    document.getElementById(editableID).classList.add("complete");
  } else {
    document.getElementById(editableID).classList.remove("complete");
  }
  document.getElementById(editableID).innerHTML = `
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
      <div class="col-8">
         <p class="fs-5"> ${task.note} </p>
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
   </div>`;
}

function countTasks() {
  let completed = tasks.filter((task) => task.isCompleted == true);
  let pending = tasks.length - completed.length;
  pendingProgressBar.style.width = `${(pending / tasks.length) * 100}%`;
  completedProgressBar.style.width = `${
    (completed.length / tasks.length) * 100
  }%`;
}
