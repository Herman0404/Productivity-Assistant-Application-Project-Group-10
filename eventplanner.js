class Event {
    // Constructor that builds the object used
    constructor(title, startDate, endDate) {
    this.title = title;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
    }
}

document.addEventListener('DOMContentLoaded', function() {
// Creates a new event
let form = document.querySelector("#add-event-form");

form.addEventListener("submit", (e)=>{
    
    e.preventDefault();

    let events = (JSON.parse(localStorage.getItem("events")) || []).map(event => 
        new Event(event.title, new Date(event.startDate), new Date(event.endDate))
    );

    let editingIndex = form.getAttribute("data-editing-index");

    // Simple try catch just incase
    let title = document.querySelector("#event-title").value;
    let startDate = document.querySelector("#event-startDate").value;
    let endDate = document.querySelector("#event-endDate").value;
        
    // Checks if inputs are correct
    if(checkEventValidity(title, startDate, endDate)){
        const event = new Event(title, startDate, endDate);

        if (editingIndex !== null) {
            events[editingIndex] = event;
            form.removeAttribute("data-editing-index");
        } else {
            events.push(event);
        }
        // Uses the inputs to create a new event object

           
        eventsUpdate(events);
        displayEvents();
        form.reset();
    }
});

displayEvents();

});



function displayEvents(){

    let events = (JSON.parse(localStorage.getItem("events")) || []).map(event => 
        new Event(event.title, new Date(event.startDate), new Date(event.endDate))
    );

    let eventList = document.querySelector("#event-list");

    //clear the task list before displaying the tasks
    eventList.innerHTML = "";

    //loop through the tasks array and display each task on the screen

    events.forEach((event, index) => {
        let li = document.createElement("li");
        li.classList.add("event-item");

        const timeFormat = ("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const startDate = event.startDate.toLocaleDateString("sv-SE");
        const startTime = event.startDate.toLocaleTimeString("sv-SE", timeFormat);
        const endDate = event.endDate.toLocaleDateString("sv-SE");
        const endTime = event.endDate.toLocaleTimeString("sv-SE", timeFormat);

        li.innerHTML = `
            <div class="event-details">
                <h3>${event.title}</h3>
                    <p><strong>StartDate:</strong> ${startDate} ${startTime}</p>
                <p><strong>EndDate</strong> ${endDate} ${endTime}</p>
            </div>
            <div class="task-actions">
                <button onclick="editEvent(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteEvent(${index})">Delete</button>
            
            </div>
            `;
        eventList.appendChild(li);
        
    });
}

// Function to check if startDate is before endDate
function checkEventValidity(title, startDate, endDate){
    // Checks if title input is empty
    if(title != ""){
        // Checks if startDate is valid and if startDate is an earlier date than endDate
        if(startDate < endDate && startDate){
            return true;
        } else {
            alert("Date and time input problem, please make sure the dates and times are correct");
            return false;
        }
    } else {
        alert("Input a valid title for the event")
        return false;
    }
    
}

function sortEvents(events){
    events.sort((a, b) => a.startDate - b.startDate);
}

function eventsUpdate(events){
    sortEvents(events);
    localStorage.setItem("events", JSON.stringify(events));
}

function editEvent(index){
    let events = (JSON.parse(localStorage.getItem("events")) || []).map(event => 
        new Event(event.title, new Date(event.startDate), new Date(event.endDate))
    );
    let event = events[index]; //get the task at the given index to be edited
    
    // fill the form with the task details to be edited
    let form = document.querySelector("#add-event-form");
    //set the form values to the task details
    document.querySelector("#event-title").value = event.title;

    //set the form attribute to the index of the task being edited
    form.setAttribute("data-editing-index", index);
   
    //save the updated tasks array back to local storage
    localStorage.setItem("events", JSON.stringify(events));
    //refresh the task list on the screen
    displayEvents();
}

function deleteEvent(index){

    let events = (JSON.parse(localStorage.getItem("events")) || []).map(event => 
        new Event(event.title, new Date(event.startDate), new Date(event.endDate))
    );

    events.splice(index, 1);


    localStorage.setItem("events", JSON.stringify(events));

    displayEvents();
}

