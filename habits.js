
let addHabitForm = document.querySelector("#add-habit-form");
addHabitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let habits = JSON.parse(localStorage.getItem)
})













// // Hämta sparade rutiner från localStorage eller skapa en tom array
// let habits = JSON.parse(localStorage.getItem("habits")) || [];

// // Funktion för att spara rutiner i localStorage
// function saveHabits() {
//   localStorage.setItem("habits", JSON.stringify(habits));
// }

// // Funktion för att rendera rutiner i listan
// function renderHabits(filteredHabits = habits) {
//   const habitsContainer = document.getElementById("habits-container");
//   habitsContainer.innerHTML = ""; // Rensa innehåll

//   filteredHabits.forEach((habit, index) => {
//     const habitElement = document.createElement("div");
//     habitElement.classList.add("habit");

//     habitElement.innerHTML = `
//             <h3>${habit.title}</h3>
//             <p>Repetitions: <strong>${habit.repetitions}</strong></p>
//             <p>Priority: ${habit.priority}</p>
//             <button onclick="changeRepetitions(${index}, 1)">+1</button>
//             <button onclick="changeRepetitions(${index}, -1)">-1</button>
//             <button onclick="resetRepetitions(${index})">Reset</button>
//             <button onclick="deleteHabit(${index})">Delete</button>
//         `;

//     habitsContainer.appendChild(habitElement);
//   });
// }

// // Funktion för att lägga till en ny rutin
// document
//   .getElementById("add-habit-form")
//   .addEventListener("submit", function (event) {
//     event.preventDefault();

//     const title = document.getElementById("habit-title").value;
//     const priority = document.querySelector(
//       'input[name="habit-prio"]:checked'
//     ).value;

//     if (title.trim() === "") return; // Stoppa om titeln är tom

//     habits.push({ title, repetitions: 0, priority });
//     saveHabits();
//     renderHabits();

//     // Rensa formuläret
//     document.getElementById("habit-title").value = "";
//   });

// // Funktion för att öka eller minska repetitioner
// function changeRepetitions(index, amount) {
//   habits[index].repetitions = Math.max(0, habits[index].repetitions + amount);
//   saveHabits();
//   renderHabits();
// }

// // Funktion för att nollställa repetitioner
// function resetRepetitions(index) {
//   habits[index].repetitions = 0;
//   saveHabits();
//   renderHabits();
// }

// // Funktion för att ta bort en rutin
// function deleteHabit(index) {
//   habits.splice(index, 1);
//   saveHabits();
//   renderHabits();
// }

// // Funktion för att filtrera rutiner baserat på prioritet
// document
//   .getElementById("filter-priority")
//   .addEventListener("change", function (event) {
//     const selectedPriority = event.target.value;

//     if (selectedPriority === "all") {
//       renderHabits();
//     } else {
//       const filteredHabits = habits.filter(
//         (habit) => habit.priority === selectedPriority
//       );
//       renderHabits(filteredHabits);
//     }
//   });

// // Funktion för att sortera rutiner efter repetitioner
// document
//   .getElementById("sort-repetitions")
//   .addEventListener("change", function (event) {
//     const order = event.target.value;

//     habits.sort((a, b) =>
//       order === "ascending"
//         ? a.repetitions - b.repetitions
//         : b.repetitions - a.repetitions
//     );
//     saveHabits();
//     renderHabits();
//   });

// // Ladda in sparade rutiner vid start
// renderHabits();
