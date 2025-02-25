
document.addEventListener("DOMContentLoaded", function () {
  let habitForm = document.querySelector(".add-habit-form");
  let habitsContainer = document.getElementById("habits-container");
  let filterPrio = document.getElementById("filter-priority");
  let sortRepetitions = document.getElementById("sort-repetitions");


  habitForm.addEventListener("submit", function (event) {
    event.preventDefault(); // preventing from refreshing page upon submitting form

    let habits = JSON.parse(localStorage.getItem("habits")) || [ ]; // get prev saved habits from localStorage, OR create empty array if none exists to store upcoming submitted habits
    let habitTitle = document.getElementById("habit-title").value;
    let habitPriority = document.querySelector("input[name='habit-prio']:checked")

    let habit = {
        title: habitTitle,
        priority: habitPriority,
        repetitions: 0
    };

    habits.push(habit);
    localStorage.setItem("habits", JSON.stringify(habits));

    displayHabits();
  });

  function displayHabits() {
    let habits = JSON.parse(localStorage.getItem("habits")) || [ ];
    // habitsContainer.innerHTML ="";

    let habitElement = document.createElement("div");
    habitElement.classList.add("habit-item");

    habitElement.innerHTML = " " ;
  }
})






// let addHabitForm = document.querySelector("#add-habit-form");
// addHabitForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   let habits = JSON.parse(localStorage.getItem)
// })