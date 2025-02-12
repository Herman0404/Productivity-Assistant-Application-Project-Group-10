class Event {
    constructor(name, startDate, endDate) {
      this.name = name;
      this.startDate = new Date(startDate);
      this.endDate = new Date(endDate);
    }
  }

const eventsArray = [
    new Event("Event1", "2024-01-01", "2024-12-31"),
    new Event("Event2", "2024-08-01", "2024-09-31")
]

console.log(eventsArray)