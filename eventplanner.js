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

        if(name != "" && startDate && endDate){
            
            // Uses the inputs to create a new event object
            const newEvent = new Event(name, startDate, endDate);
            // Pushes object into array list
            eventsArray.push(newEvent);
            console.log(eventsArray)
        } else{
            alert("invalid entry")
        }
        
    }

    catch{
        alert("something went wrong")
    }
}


console.log(eventsArray)