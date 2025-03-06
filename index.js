// code by mansi ---Logout Functionality
document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("currentUser"); // Remove session
  window.location.href = "login.html"; // Redirect to login page
});

//code by mansi ----for welcome
// Step 1: Check if user is logged in
//make sure the page is fully loaded before running script 
document.addEventListener("DOMContentLoaded", function () {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
  // If no user is logged in, redirect to login page
  window.location.href = "login.html"; 
  return;
  
  }    

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userData = users.find(user => user.email === currentUser.email);

  if (userData) {
       // Display welcome message with user's name
      document.getElementById("welcome-msg").innerText = `Welcome, ${currentUser.name}!`;
      
      displayTasks();
      displayHabits();
      displayEvents();
      fetchQuote();
  }
});


function displayTasks(){

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
      window.location.href = "login.html"; // Redirect if not logged in
      return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userData = users.find(user => user.email === currentUser.email);
  let tasks = userData ? userData.tasks : [];

  //let tasks = JSON.parse(localStorage.getItem("tasks")) || []; //parse the string to convert it to an array
  let taskList = document.querySelector("#tasks"); //this is the ul element where the tasks will be displayed
  
  // clear the existing list
  taskList.innerHTML = "";

  // creates array with only not-completed tasks
 let filteredTasks = tasks.filter(task => task.status !== "Completed");
      
  // get the 3 closest tasks based on deadline
  let showTasks = getClosestDates(filteredTasks);

  if(showTasks.length !== 0){
      //loop through the tasks array and display each task on the screen
      showTasks.forEach(task => { 
          //tasks.forEach((task, index) => {
          let li = document.createElement("li");
          li.classList.add("list-item");
      
          // Task status display (Updates dynamically)
          li.innerHTML = `
              <div class="task-details">
                  <h3><strong>${task.title}</strong></h3>
                  <p><strong>Description:</strong> ${task.description}</p>
                  <p><strong>Time Estimate:</strong> ${task.timeEstimate} hours</p>
                  <p><strong>Category:</strong> ${task.category}</p>
                  <p><strong>Deadline:</strong> ${task.deadline}</p>
              </div>`;
          taskList.appendChild(li);
      });    
  } else {
      let li = document.createElement("li");
      li.classList.add("list-item")

      li.innerHTML = `
      <div class="task-details">
          <h3><strong>No uncompleted tasks</strong></h3>
      </div>`;
      taskList.appendChild(li);
  }
  
}


function getClosestDates(tasks) {
  const now = Date.now();
  return tasks
      // Sorts based on when they were added 
      .sort((a, b) => Math.abs(Number(a.date) - now) - Math.abs(Number(b.date) - now))
      // Saves closest 3 
      .slice(0, 3); 
}

function displayHabits(){
    // Ensure user is logged in
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
      window.location.href = "login.html"; // Redirect if not logged in
      return;
  }

  // Retrieve users and find the current user's data
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userData = users.find(user => user.email === currentUser.email);
  let habits = userData ? userData.habits : [];
  let showHabits = habitRepitions(habits)

  // Takes only the 3 upcoming events
  let habitList = document.querySelector("#habits");
  habitList.innerHTML = "";

  if(showHabits != 0){
    showHabits.forEach(habit => { 
        let li = document.createElement("li");
        li.classList.add("list-item");
    
        // Task status display (Updates dynamically)
        li.innerHTML = `
            <div class="habit-details">
                <h3>${habit.title}</h3>
				<p><strong>Priority:</strong> ${habit.priority}</p>
				<p><strong>Repetitions:</strong> <span id="reps-${habit.id}"> ${habit.repetitions}</span></p>
            </div>`;
        habitList.appendChild(li);
    });    
  } else {
    let li = document.createElement("li");
      li.classList.add("list-item")

      li.innerHTML = `
      <div class="habit-details">
          <h3><strong>No habits created</strong></h3>
      </div>`;
      habitList.appendChild(li);
  }
  
}

function habitRepitions(habits){
    const showHabits = habits
    .sort((a, b) => b.repetitions - a.repetitions)
    .slice(0, 3);
    return showHabits;
}

// Event display
function displayEvents(){
  // Ensure user is logged in
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
      window.location.href = "login.html"; // Redirect if not logged in
      return;
  }

  // Retrieve users and find the current user's data
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userData = users.find(user => user.email === currentUser.email);
  let events = userData ? userData.events : [];

  let notPassedEvents = [];
  // Takes current date to compare
  let currentDate = Date.now();
  // Ads every event that hasnt started into an array
  events.forEach(event => {
      event.startDate = new Date(event.startDate);
      event.endDate = new Date(event.endDate);
      if(event.startDate.getTime() > currentDate){
          notPassedEvents.push(event);
      }
  });

  // Takes only the 3 upcoming events
  let showEvents = notPassedEvents.slice(0, 3);
  let eventList = document.querySelector("#events");
  eventList.innerHTML = "";

  // Displays events
  if(showEvents != 0){
      showEvents.forEach(event => { 
          // Variable to create a new list inside event
          let li = document.createElement("li");
          // Adds class "list-item" to the item
          li.classList.add("list-item");
          
          // Makes sure the format is displayed as yyyy-mm-dd hh:mm
          const timeFormat = ("sv-SE", {
              hour: "2-digit",
              minute: "2-digit",
          });
          // Applies aformentioned formating
          const startDate = event.startDate.toLocaleDateString("sv-SE");
          const startTime = event.startDate.toLocaleTimeString("sv-SE", timeFormat);
          const endDate = event.endDate.toLocaleDateString("sv-SE");
          const endTime = event.endDate.toLocaleTimeString("sv-SE", timeFormat);
          // Creates inner html for event
          li.innerHTML = `
              <div class="event-details">
                  <h3><strong>${event.title}</strong></h3>
                  <p><strong>Start:</strong> ${startDate} ${startTime}</p>
                  <p><strong>End:</strong> ${endDate} ${endTime}</p>
              </div>`;
          // Adds into event list ul
          eventList.appendChild(li);
      });
  } else {
      let li = document.createElement("li");
      // Adds class "list-item" to the item
      li.classList.add("list-item");

      li.innerHTML = `
          <div class="event-details">
              <h3><strong>No upcoming events</strong></h3>
          </div>`;
      eventList.appendChild(li);
  }
  
}

async function fetchQuote() {
  const url = "https://dummyjson.com/quotes/random";
  const quote = document.getElementById("quote");
  const author = document.getElementById("author");
  
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      quote.innerHTML = json.quote;
      author.innerHTML = json.author;  
  } catch (error) {
    console.error(error.message);
  }
}