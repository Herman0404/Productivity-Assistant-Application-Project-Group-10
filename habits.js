// Logout Functionality
document.querySelector(".logout-btn").addEventListener("click", () => {
	localStorage.removeItem("currentUser"); // Remove session
	window.location.href = "login.html"; // Redirect to login page
});

document.addEventListener("DOMContentLoaded", function () {
	let habitForm = document.querySelector(".add-habit-form");
	let habitsContainer = document.getElementById("habits-container");
	let filterPrio = document.getElementById("filter-priority");
	let sortRepetitions = document.getElementById("sort-repetitions");

	habitForm.addEventListener("submit", function (event) {
		event.preventDefault();

		let habits = JSON.parse(localStorage.getItem("habits")) || [];
		let habitTitle = document.getElementById("habit-title").value;
		let habitPriority = document.querySelector(
			"input[name='habit-prio']:checked"
		)?.value;

		if (!habitTitle || !habitPriority) {
			alert(
				"Kindly input a title for your habit/routine and its priority level"
			);
			return;
		}

		let habit = {
			title: habitTitle,
			priority: habitPriority,
			repetitions: 0,
		};

		habits.push(habit);
		localStorage.setItem("habits", JSON.stringify(habits));

		displayHabits();
		habitForm.reset();
	});

	function displayHabits() {
		let habits = JSON.parse(localStorage.getItem("habits")) || [];

		// apply filtering
		let selectedPriority = filterPrio.value;
		if (selectedPriority !== "all") {
			habits = habits.filter((habit) => habit.priority === selectedPriority);
		}

		// apply sorting
		let sortOrder = sortRepetitions.value;
		if (sortOrder === "ascending") {
			habits.sort((a, b) => a.repetitions - b.repetitions);
		} else if (sortOrder === "descending") {
			habits.sort((a, b) => b.repetitions - a.repetitions);
		}

		// Clear & re-render habits
		habitsContainer.innerHTML = "";
		habits.forEach((habit, index) => {
			let habitElement = document.createElement("div");
			habitElement.classList.add("habit-item");

			habitElement.innerHTML = `
				<h3>${habit.title}</h3>
				<p><strong>Priority:</strong> ${habit.priority}</p>
				<p><strong>Repetitions:</strong> ${habit.repetitions}</p>
				<button onclick="increaseRepetitions(${index})">+1</button>
				<button onclick="deleteHabit(${index})">Delete</button>
			`;
			habitsContainer.appendChild(habitElement);
		});
	}

	window.increaseRepetitions = function (index) {
		let habits = JSON.parse(localStorage.getItem("habits")) || [];
		habits[index].repetitions++;
		localStorage.setItem("habits", JSON.stringify(habits));
		displayHabits();
	};

	window.deleteHabit = function (index) {
		let habits = JSON.parse(localStorage.getItem("habits")) || [];
		habits.splice(index, 1);
		localStorage.setItem("habits", JSON.stringify(habits));
		displayHabits();
	};

	// Update the displayed habits whenever filtering or sorting is changed
	filterPrio.addEventListener("change", displayHabits);
	sortRepetitions.addEventListener("change", displayHabits);

	// Initial load
	displayHabits();
});
