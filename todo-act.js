// Logout Functionality
document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("currentUser"); // Remove session
  window.location.href = "login.html"; // Redirect to login page
});


function displayDate (){
  let date = new Date();
  date = date.toDateString().split(' ');
  document.getElementById('date').innerHTML = date[0] + ', ' + date[2] + ' ' + date[1] + ' ' + date[3];
}
window.onload = function() {
  displayDate();
}
document.addEventListener('DOMContentLoaded', function() {
  //this ensures that the javascript runs only after the HTML document has been fully loaded
  // if we try to access elements before the page loads, javascript might not find them

  //get the form element from the HTML document
let form = document.querySelector("#add-task-form");
form.addEventListener("submit", (e)=>{
  
  e.preventDefault(); //prevent the page from refreshing when the form is submitted
 
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
      window.location.href = "login.html"; // Redirect if not logged in
      return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userData = users.find(user => user.email === currentUser.email);

  if (!userData) return; // If user data is not found, stop


   /*//GET TASK FROM LOCAL STORAGE-retrieve existing tasks from local storage or create an empty array if there are no tasks 
  //  -so we do not overwrite existing tasks when adding a new one 
  let tasks = JSON.parse(localStorage.getItem("tasks")) || []; //parse the string to convert it to an array
  // get the index of the task being edited from the form attribute
  let editingIndex = form.getAttribute("data-editing-index");*/
  
  // get user input values from the form
  let title = document.querySelector("#task-title").value;
  let description = document.querySelector("#task-desc").value;
  let status = document.querySelector("#task-status").value;
  let timeEstimate = document.querySelector("#task-time").value;
  let category = document.querySelector("#task-category").value;
  let deadline = document.querySelector("#task-deadline").value;

  // create a new task object with the user input values- this object will be sent to the server
  // it makes easier to store in local storage and display later

  let task = {
      title: title,
      description: description,
      status: status,
      timeEstimate: timeEstimate,
      category: category,
      deadline: deadline,
      createdAt: Date.now() // Ensure each task has a unique ID
  };

   // get the index of the task being edited from the form attribute
   let editingIndex = form.getAttribute("data-editing-index");

  if (editingIndex !== null) {
      // if ediitng index is not null, it means we are editing an existing task instead of adding a new one
      userData.tasks[editingIndex] = task;
      form.removeAttribute("data-editing-index");
  } else {
      // if editing index is null, it means we are adding a new task
     userData.tasks.unshift(task);
  }

     
  //add the new task to the tasks array - so that all the tasks (old+new) are saved together in local storage
  //tasks.push(task);
  
  //save the tasks array back to local storage- local storage does not accept objects, so we convert the array to a string
  localStorage.setItem("users", JSON.stringify(users)); //convert the array to a string before saving it to local storage
  
  //refresh the task list on the screen-as soon as a new task is added
  displayTasks();

  // clear the form after submitting
  form.reset();

});

//display tasks when the page loads- this ensures that tasks are displayed even after refreshing the page   
displayTasks();

});

function displayTasks(){
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
      window.location.href = "login.html";
      return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || []; //parse the string to convert it to an array
  let userData = users.find(user => user.email === currentUser.email);

  if (!userData) return;

  let taskList = document.querySelector("#task-list"); //this is the ul element where the tasks will be displayed
  taskList.innerHTML = ""; // clear previous tasks

  // get filter and sort values from the form
  let filterStatus = document.querySelector("#status-filter").value;
  let filterCategory = document.querySelector("#category-filter").value;
  let sortBy = document.querySelector("#sort-options").value;

 // Apply filtering
 let filteredTasks = userData.tasks.filter(task => {
  
      let statusMatch = 
      filterStatus === "all" || 
      (filterStatus === "completed" && task.status === "Completed") || 
      (filterStatus === "not-completed" && task.status !== "Completed");

  let categoryMatch = filterCategory === "all" || task.category === filterCategory;

  return statusMatch && categoryMatch;
});

// Apply sorting
filteredTasks.sort((a, b) => {
  if (sortBy === "deadline-asc") return new Date(a.deadline) - new Date(b.deadline);
  if (sortBy === "deadline-desc") return new Date(b.deadline) - new Date(a.deadline);
  if (sortBy === "time-asc") return a.timeEstimate - b.timeEstimate;
  if (sortBy === "time-desc") return b.timeEstimate - a.timeEstimate;
  if (sortBy === "status-completed") return a.status === "Completed" ? -1 : 1;
  if (sortBy === "status-not-completed") return a.status !== "Completed" ? -1 : 1;
});

  //clear the existing list
 // taskList.innerHTML = "";

  //loop through the tasks array and display each task on the screen

  filteredTasks.forEach(filteredTask => { 
      let originalIndex = userData.tasks.findIndex(t => t.createdAt === filteredTask.createdAt); // Get correct index from local storage
  
  //filteredTasks.forEach((task, index) => {
      let li = document.createElement("li");
      li.classList.add("task-item");

      // Task status display (Updates dynamically)
      let statusText = filteredTask.status === "Completed" ? "Completed" : "Not Completed ";

      li.innerHTML = `
          <div class="task-details">
              <h3>${filteredTask.title}</h3>
               <p><strong>Description:</strong> ${filteredTask.description}</p>
              <p><strong>Status:</strong> <span class="task-status">${filteredTask.status}</span></p>
              <p><strong>Time Estimate:</strong> ${filteredTask.timeEstimate} hours</p>
              <p><strong>Category:</strong> ${filteredTask.category}</p>
              <p><strong>Deadline:</strong> ${filteredTask.deadline}</p>
          </div>
          <div class="task-actions">
              <button class="edit-btn" onclick = "${filteredTask.closed ? 'alertTaskClosed()' : `editTask(${originalIndex})`}">Edit</button>
              <button class="delete-btn" onclick="deleteTask(${originalIndex})">Delete</button>
              
              <!-- Checkbox for marking as completed -->
              <input type="checkbox" class="complete-checkbox" ${filteredTask.status === "Completed" ? "checked" : ""} 
                  onclick="toggleTaskCompletion(${originalIndex})">
              <label>
                  ${filteredTask.status === "Completed" ? "Mark as Not Completed" : "Mark as Completed"}
              </label>

          
          </div>
          `;
      taskList.appendChild(li);
      
  });
}

function applyFiltersAndSort() {
  displayTasks(); // Just call displayTasks(), since it already handles filtering & sorting
}


// function to edit a task
function editTask(index){

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userData = users.find(user => user.email === currentUser.email);

  if (!userData) return;

  let task = userData.tasks[index];//get the task at the given index to be edited

    
     
  // fill the form with the task details to be edited
  let form = document.querySelector("#add-task-form");
 
  //set the form values to the task details
  form.querySelector("#task-title").value = task.title;
  form.querySelector("#task-desc").value = task.description;
  form.querySelector("#task-status").value = task.status;
  form.querySelector("#task-time").value = task.timeEstimate;
  form.querySelector("#task-category").value = task.category;
  form.querySelector("#task-deadline").value = task.deadline;

  //set the form attribute to the index of the task being edited
  form.setAttribute("data-editing-index", index);
 
  //save the updated tasks array back to local storage
  localStorage.setItem("users", JSON.stringify(users));
  //refresh the task list on the screen
  displayTasks();
}

// function to delete a task
function deleteTask(index){
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let users = JSON.parse(localStorage.getItem("users")) || [];
  //remove the task from the tasks array
  let confirmDelete = confirm("Are you sure you want to delete this task?");
  if (!confirmDelete){
      return;
  }

  let userData = users.find(user => user.email === currentUser.email);

  if (!userData) return;

  userData.tasks.splice(index, 1); // Remove task
  
  
  //save the updated tasks array back to local storage
  localStorage.setItem("users", JSON.stringify(users));

  //refresh the task list on the screen
  displayTasks();
  
}




// function to mark a task as completed or not completed
function toggleTaskCompletion(index) {

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userData = users.find(user => user.email === currentUser.email);

  if (!userData) return;

  

  // Toggle the task status
  userData.tasks[index].status = userData.tasks[index].status === "Completed" ? "not-completed" : "Completed";

  // Save the updated tasks back to local storage
  localStorage.setItem("users", JSON.stringify(users));

  // Refresh the UI
  displayTasks();
}
