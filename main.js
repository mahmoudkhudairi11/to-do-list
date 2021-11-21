var
  taskTitleAreaEl = document.querySelector(".tasktitle"),
  taskTitleEl     = document.getElementById("tasktitle"),
  addTaskEl       = document.getElementById("addtask"),
  tasksEl         = document.querySelector(".tasks"),
  countEl         = document.querySelector(".count");
function newID() {
  var id  = "";
  for (let i = 0; i < 10; i++) id += Math.floor(Math.random() * 10);
  return id;
}
function tasksCount() {
  var tasks = localStorage.todotasks ? JSON.parse(localStorage.todotasks) : 0;
  if (!tasks) return 0;
  var ent = Object.entries(tasks);
  return [ent.length, ent.filter(_ => _[1].done).length];
}
function updateCount() {
  var [count, doneCount] = tasksCount();
  if (count && !doneCount) return countEl.textContent = `${count} Task${count > 1 ? "s" : ""}`;
  if (count && count == doneCount) return countEl.textContent = "All Tasks Done!";
  countEl.textContent = count ? `${doneCount} Task${doneCount > 1 ? "s" : ""} Done of ${count}` : `Add Your First Task.`;
}
function createTaskEl(id, title, done = false) {
  var taskEl = document.createElement("div");
  taskEl.classList.add("task");
  taskEl.dataset.id = id;
  if (done) taskEl.classList.add("done");
  taskEl.innerHTML =
`<div class="title">${title}</div>
<div class="remove">X</div>
<div class="done">✔</div>`;
  taskEl.querySelector(".done").addEventListener("click", doneTask.bind(this, id));
  taskEl.querySelector(".remove").addEventListener("click", removeTask.bind(this, id));
  tasksEl.append(taskEl);
}
var getTaskEl = (id) => document.querySelector(`.task[data-id="${id}"]`);
function addTask(id, title) {
  var tasks = localStorage.todotasks ? JSON.parse(localStorage.todotasks) : {};
  tasks[id] = {title: title};
  localStorage.todotasks = JSON.stringify(tasks);
}
function doneTask(id) {
  var tasks = JSON.parse(localStorage.todotasks);
  tasks[id].done = true;
  localStorage.todotasks = JSON.stringify(tasks);
  getTaskEl(id)?.classList.add("done");
  updateCount();
}
function removeTask(id) {
  var tasks = JSON.parse(localStorage.todotasks);
  delete tasks[id];
  localStorage.todotasks = JSON.stringify(tasks);
  getTaskEl(id)?.remove();
  updateCount();
}
taskTitleEl.addEventListener("focus", function () {
  taskTitleAreaEl.classList.add("fill");
});
taskTitleEl.addEventListener("blur", function () {
  taskTitleAreaEl.classList.remove("fill");
});
taskTitleEl.addEventListener("input", function () {
  addTaskEl.classList[this.value.length ? "remove" : "add"]("disabled");
});
addTaskEl.addEventListener("click", function () {
  if (this.classList.contains("disabled")) return;
  var id     = newID();
  createTaskEl(id, taskTitleEl.value)
  addTask(id, taskTitleEl.value);
  updateCount();
  taskTitleEl.value = "";
  this.classList.add("disabled");
});
taskTitleEl.addEventListener("keydown", function (e) {
  if (e.code == "Enter") {
    addTaskEl.click();
    this.blur();
  }
});
var tasks = localStorage.todotasks ? JSON.parse(localStorage.todotasks) : {};
for (let [id, {title, done}] of Object.entries(tasks)) createTaskEl(id, title, done);
updateCount();