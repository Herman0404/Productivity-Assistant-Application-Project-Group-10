// Array for saved events
const eventsArray = []

// Class that creates blueprint for event object
class Event {
    // Constructor that builds the object used
    constructor(name, startDate, endDate) {
      this.name = name;
      this.startDate = new Date(startDate);
      this.endDate = new Date(endDate);
    }
}

// Creates a new event
function createNewEvent(){

    // Simple try catch just incase
    try{

        // Saves name input
        const name = document.getElementById("eventName").value;

        // Saves inputs from start- and end-date
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;

        // Checks if inputs are correct
        if(checkEventValidity(name, startDate, endDate)){
            
            // Uses the inputs to create a new event object
            const newEvent = new Event(name, startDate, endDate);
            // Pushes object into array list
            eventsArray.push(newEvent);
            console.log(eventsArray)
            // Resets inputs
            resetEventInputs();
        }
        
    }

    catch{
        alert("something went wrong")
    }
}

// Function to check if startDate is before endDate
function checkEventValidity(name, startDate, endDate){
    // Checks if name input is empty
    if(name != ""){
        // Checks if startDate is valid and if startDate is an earlier date than endDate
        if(startDate < endDate && startDate){
            return true;
        } else {
            alert("Date and time input problem, please make sure the dates and times are correct");
            return false;
        }
    } else {
        alert("Input a valid name for the event")
        return false;
    }
    
}

// Function to reset the value of inputs after use
function resetEventInputs(){
    document.getElementById("eventName").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
}