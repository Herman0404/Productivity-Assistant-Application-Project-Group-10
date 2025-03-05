// check if user is logged in
function checkAuth() {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "login.html"; // redirect to login if no currentUser is active
  } else {
    document.querySelector(".logout-btn").style.display = "block";
  }
}

// main function that loads the page's content
document.addEventListener("DOMContentLoaded", function () {
  // first of all upon load, force login/sign-up prompt popup to proceed by calling function checkAuth(); :
  checkAuth();
  displayDate();

  // Logout Functionality - put INSIDE DOMContentLoaded instead of above //
  document.querySelector(".logout-btn").addEventListener("click", () => {
    localStorage.removeItem("currentUser"); // "Remove" session
    window.location.href = "login.html"; // Redirect to login page
  });

  let habitForm = document.querySelector(".add-habit-form");
  let habitsContainer = document.getElementById("habits-list");
  let filterPrio = document.getElementById("filter-priority");
  // sorting: 
  let sortRepetitions = document.getElementById("sort-repetitions");
  let sortPriority = document.getElementById("sort-priority");

  habitForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let habitList = JSON.parse(localStorage.getItem("habits")) || [];
    let habitTitle = document.getElementById("habit-title").value;
    let habitPriority = document.querySelector(
      "input[name='habit-prio']:checked"
    )?.value;

    if (!habitTitle || !habitPriority) {
      alert("Kindly input a title for your habit and its priority level!");
      return;
    }

    let habitItem = {
      id: Date.now(), // assign a unique ID based on timestamp //
      title: habitTitle,
      priority: habitPriority,
      repetitions: 0,
    };

    habitList.push(habitItem);
    //save the habits array to local storage - local storage does not accept 'objects', so it's converted into a string (.stringify)
    localStorage.setItem("habits", JSON.stringify(habitList));

    displayHabits();    //re-display habits list as soon as a new task is added
    habitForm.reset(); // clears the fields of the form upon submit
  });


  function displayHabits() {
    let habitList = JSON.parse(localStorage.getItem("habits")) || [];

    // apply Filtering by priority ( selectedFilterPriority )
    let selectedFilterPriority = filterPrio.value;
    if (selectedFilterPriority !== "all") {
      habitList = habitList.filter(
        (habitItem) => habitItem.priority === selectedFilterPriority
      );
    }

    // apply Sorting by repetitions ( selectedSortOrder )
    let selectedSortOrder = sortRepetitions.value;
    if (selectedSortOrder === "ascending") {
      habitList.sort((a, b) => a.repetitions - b.repetitions);
    } 
    else if (selectedSortOrder === "descending") {
      habitList.sort((a, b) => b.repetitions - a.repetitions);
    }


    // apply Sorting by priority ( selectedPrioOrder )
    let selectedPrioOrder = sortPriority.value;
    if (selectedPrioOrder === "ascending") {
      habitList.sort((a, b) => prioIntValue(a.priority) - prioIntValue(b.priority));
    } 
    else if (selectedPrioOrder === "descending") {
      habitList.sort((a, b) => prioIntValue(b.priority) - prioIntValue(a.priority));
    }


    // clear and display habitList (again)
    habitsContainer.innerHTML = "";
    habitList.forEach((habitItem) => {
      let habitElement = document.createElement("div");
      habitElement.classList.add("habitItem-item");

          // decreaseRepetitions function 
      habitElement.innerHTML = `
				<h3>${habitItem.title}</h3>
				<p><strong>Priority:</strong> ${habitItem.priority}</p>
				<p><strong>Repetitions:</strong> <span id="reps-${habitItem.id}"> ${habitItem.repetitions}</span></p>
        <button onclick="decreaseRepetitions(${habitItem.id})">-1</button> 
        <button onclick="increaseRepetitions(${habitItem.id})">+1</button> 
				<button onclick="deleteHabit(${habitItem.id})">Remove habit</button>
			`;
  
      habitsContainer.appendChild(habitElement);
    });
  }

// Conversion function (basically) for only assigning INT values to prio-levels (low,medium,high)(strings) for sort() function: 
  function prioIntValue(priority) { 
    const priorityLevels = { "low": 1, "medium": 2, "high": 3 };
    return priorityLevels[priority] || 0;
  }

  window.increaseRepetitions = function (habitId) {
    let habitList = JSON.parse(localStorage.getItem("habits")) || [];
    let habitItem = habitList.find((h) => h.id === habitId);
    if (habitItem) {
      habitItem.repetitions++;
      localStorage.setItem("habits", JSON.stringify(habitList));
      displayHabits();
    }
  };

  // function for decreasing repetition count if needed //
  window.decreaseRepetitions = function (habitId) {
    let habitList = JSON.parse(localStorage.getItem("habits")) || [];
    let habitItem = habitList.find((h) => h.id === habitId);

    // added if-statement to prevent repetition-count going below 0 //
    if (habitItem) {
      if (habitItem.repetitions > 0) {
        habitItem.repetitions--;
        localStorage.setItem("habits", JSON.stringify(habitList));
        displayHabits();
      }
    }
  };

  // function to delete a task
  window.deleteHabit = function (habitId) {
    let habitList = JSON.parse(localStorage.getItem("habits")) || [];
    habitList = habitList.filter((h) => h.id !== habitId); //remove by ID
    localStorage.setItem("habits", JSON.stringify(habitList));
    displayHabits();
  };

  // update the displayed habits whenever filtering or sorting is changed, rather than having a button to apply filters onclick
  filterPrio.addEventListener("change", displayHabits);
  sortRepetitions.addEventListener("change", displayHabits);
  sortPriority.addEventListener("change", displayHabits);

  // upon initial load
  displayHabits();
});

// display current date and time just because
function displayDate() {
  let date = new Date().toDateString().split(" ");
  document.getElementById(
    "date"
  ).innerHTML = `${date[0]}, ${date[2]} ${date[1]} ${date[3]}`;
}
