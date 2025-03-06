// Logout Functionality
document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("currentUser"); // Remove session
  window.location.href = "login.html"; // Redirect to login page
});

class Event {

  // constructor that builds the object used
  constructor(title, startDate, endDate, status, index) {
  this.title = title;
  this.startDate = new Date(startDate);
  this.endDate = new Date(endDate);
  this.status = status;
  this.index = index;   
  }
}

function displayDate (){
  let date = new Date();
  date = date.toDateString().split(' ');
  document.getElementById('date').innerHTML = date[0] + ', ' + date[2] + ' ' + date[1] + ' ' + date[3];
}
  
document.addEventListener('DOMContentLoaded', function() {
  filterEvents();
  displayDate();
// creates a new event
let form = document.querySelector("#add-event-form");

// event listener to submit button
form.addEventListener("submit", (e)=>{
  
  // prevents form from refreshing site
  e.preventDefault();

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
          window.location.href = "login.html"; // Redirect if not logged in
          return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];
      let userData = users.find(user => user.email === currentUser.email);
      if (!userData) return;

  // takes localdata saved events into an array
  // map takes stringified versions of dates and makes them into date version (needed for calculations later)
  //let events = getArray()

  // takes a value from the form to check wether or not its an edit
  //let editingIndex = form.getAttribute("data-editing-index");

  // saves values from the form
  let title = document.querySelector("#event-title").value;
  let startDate = document.querySelector("#event-startDate").value;
  let endDate = document.querySelector("#event-endDate").value;
  const endTimestamp = new Date(endDate).getTime();
  
  // checks if all inputs are correct
  if(checkEventValidity(title, startDate, endDate)){
      // gives status dependent on passed or not
      let status = "passed";
      if(endTimestamp > Date.now()){
          status = "not-passed"
      }

      const event = new Event(title, startDate, endDate, status, Date.now());
      // checks using editingindex if its an edit or not
      let editingIndex = form.getAttribute("data-editing-index");
      if (editingIndex !== null) {
          // if it is edit, exchange new event with old one
          userData.events[editingIndex] = event;
          form.removeAttribute("data-editing-index");
      } else {
          // if its not an edit, add it into the array
          userData.events.push(event);
      }
      
      // sorts events, updates local storage, filters events
      sortEvents(userData.events)
      saveUserEvents(users);
      // resets forms
      form.reset();
      filterEvents();
  }
});

// variable for event-filter 
var filter = document.getElementById("event-filter");

// upon changes in filter, run filterEvents function
filter.addEventListener("change", filterEvents)

// function that runs when the site loads, displays the array
filterEvents();
});

function saveUserEvents(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// function that displays an array (in this case events)
function displayEvents(events){
  // variable for output place
  checkEventStatus();
  let eventList = document.querySelector("#event-list");

  if (!eventList) {
      console.error("Error: #event-list not found on the page.");
      return;
  }

  // clears the event list before displaying the events
  eventList.innerHTML = "";


  if (events.length === 0) {
      eventList.innerHTML = `<li class="event-item"><h3>No events found</h3></li>`;
      return;
  }

  // loops through and displays each event
  events.forEach(event => {
      let eventEndDate = new Date(event.endDate);// convert to date
      // variable to create a new list inside event
      let li = document.createElement("li");
      // adds class "event-item" to the item
      li.classList.add("event-item");
      
      // makes sure the format is displayed as yyyy-mm-dd hh:mm
      const timeFormat = ("sv-SE", {
          hour: "2-digit",
          minute: "2-digit",
      });

      const startDate = event.startDate.toLocaleDateString("sv-SE");
      const startTime = event.startDate.toLocaleTimeString("sv-SE", timeFormat);
      const endDate = event.endDate.toLocaleDateString("sv-SE");
      const endTime = event.endDate.toLocaleTimeString("sv-SE", timeFormat);

      // Adds text into list item
      li.innerHTML = `
          <div class="event-details">
              <h3>${event.title}</h3>
                  <p><strong>Start:</strong> ${startDate} ${startTime}</p>
              <p><strong>End:</strong> ${endDate} ${endTime}</p>
          </div>
          <div class="event-actions">
              <button class="edit-btn" onclick="editEvent(${event.index})">Edit</button>
              <button class="delete-btn" onclick="deleteEvent(${event.index})">Delete</button>
          
          </div>
          `;
      if(event.status === "passed"){
          li.classList.add("passed");
      } else {
          li.classList.remove("passed");
      }
      // puts it into the eventlist
      eventList.appendChild(li);
      
  });
}

// Function to check if startDate is before endDate
function checkEventValidity(title, startDate, endDate) {
// Checks if title input is empty
if (title != "") {
  // Checks if startDate is valid and if startDate is an earlier date than endDate
  if (startDate < endDate && startDate) {
    return true;
  } else {
    alert(
      "Date and time input problem, please make sure the dates and times are correct"
    );
    return false;
  }
} else {
  alert("Input a valid title for the event");
  return false;
}
}

// Checks if the event date has passed or not
function checkEventStatus(){
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userData = users.find(user => user.email === currentUser.email);
  if (!userData) return;

  // saves event array
  //let events = getArray()

  // calls for current date
  let currentDate = Date.now();

  // checks if current date is before or after event date
  userData.events.forEach(event => {

      let eventEndDate = new Date(event.endDate);// convet to date object
      
      if(eventEndDate.getTime() < currentDate){
          event.status = "passed";
      } else {
          event.status = "not-passed";
      }
  });

  // saves new info into local storage
  saveUserEvents(users);
}

function getArray(){
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return [];

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userData = users.find(user => user.email === currentUser.email);

  // Ensure userData.events exists
  if (!userData || !userData.events) return [];

  return userData.events.map(event => new Event(event.title, new Date(event.startDate), new Date(event.endDate), event.status, event.index)
);
}


// makes a list based on which filter setting has been chosen

function filterEvents(){
  // saves original events array
  let events = getArray();
  // receieves which value the filter selector is on
  const selectedValue = document.getElementById("event-filter").value;
  // takes current date
  currentDate = new Date();
  // creates new array to add into
  let eventsFiltered = [];
  // checks which filter is chosen and pushes events with correct values into filtered array
  if(selectedValue === "passed"){
      events.forEach((event) => {
          if(event.endDate < currentDate){
              eventsFiltered.push(event);
          }
      })
  } else if(selectedValue === "not-passed"){
      events.forEach((event) => {
          if(event.endDate > currentDate){
              eventsFiltered.push(event);
          }
      })
  } else {
      eventsFiltered = events;
  }
  // displays filtered list 
  displayEvents(eventsFiltered)
}

// sorts events based on their startDate (earliest first)
function sortEvents(events){
  events.forEach(event => {
      event.startDate = new Date(event.startDate);    
  });
  events.sort((a, b) => a.startDate - b.startDate);
}


// edits event
function editEvent(index){
  // variable of events array
  let events = getArray()
  // saves chosen event to edit
  events.forEach((event, id) => {
      if(event.index === index){
          // saves qselect as variable
          let form = document.querySelector("#add-event-form");
          // fills in the title of the event
          document.querySelector("#event-title").value = event.title;

          //set the form attribute to the index of the event being edited
          form.setAttribute("data-editing-index", id);

          let users = JSON.parse(localStorage.getItem("users")) || [];
          let currentUser = JSON.parse(localStorage.getItem("currentUser"));
          let userData = users.find(user => user.email === currentUser.email);

          if (!userData) return;
          saveUserEvents(users);
    
        //refresh the event list on the screen
         filterEvents();
        
}
});
}

// deletes events
function deleteEvent(index) {
  // variable of event array
  let events = getArray()
  
  events.forEach((event,id) =>{
      if(event.index === index){
          if(window.confirm(`Are you sure you want to delete "${event.title}?"`)){
              events.splice(id, 1)
          }
      }
  });


  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let userData = users.find(user => user.email === currentUser.email);

  if (!userData) return;

  userData.events = events;
  saveUserEvents(users);
  // displays events
  filterEvents();
  
  
}