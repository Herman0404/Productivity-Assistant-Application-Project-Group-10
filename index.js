function displayEvents(){
    let events = (JSON.parse(localStorage.getItem("events")) || []);
    let notPassedEvents = []
    let currentDate = Date.now()
    events.forEach(event => {
        event.startDate = new Date(event.startDate);
        event.endDate = new Date(event.endDate);
        if(event.startDate.getTime() > currentDate){
            notPassedEvents.push(event);
        }
    });

    let showEvents = notPassedEvents.slice(0, 3);
    let eventList = document.querySelector("#events");
    eventList.innerHTML = "";

    showEvents.forEach(event => {
        
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
        li.innerHTML = `
            <div class="event-details">
                <h2><strong>Event</strong></h2>
                <h3>${event.title}</h3>
                    <p>Start: ${startDate} ${startTime}</p>
                <p>End: ${endDate} ${endTime}</p>
            </div>
            `;
        eventList.appendChild(li);
        
    });
}

displayEvents()