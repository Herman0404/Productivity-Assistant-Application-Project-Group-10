
// check if user is logged in
function checkAuth() {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "login.html"; // Redirect to login if no currentUser is active
  } 
  else {
    document.querySelector(".logout-btn").style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // first of all upon load, force login/sign-up prompt popup to proceed by calling function checkAuth(); :
  checkAuth();
  displayDate();

  // Logout Functionality (mansi's) - put INSIDE DOMContentLoaded instead of above //
  document.querySelector(".logout-btn").addEventListener("click", () => {
    localStorage.removeItem("currentUser"); // "Remove" session
    window.location.href = "login.html"; // Redirect to login page
  });

  let habitForm = document.querySelector(".add-habit-form");
  let habitsContainer = document.getElementById("habits-container");
  let filterPrio = document.getElementById("filter-priority");
  let sortRepetitions = document.getElementById("sort-repetitions");

  habitForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let habitList = JSON.parse(localStorage.getItem("habits")) || [];
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

    let habitItem = {
      id: Date.now(), // assign a unique ID based on timestamp //
      title: habitTitle,
      priority: habitPriority,
      repetitions: 0,
    };

    habitList.push(habitItem);
    localStorage.setItem("habits", JSON.stringify(habitList));

    displayHabits();
    habitForm.reset(); // clears the FIELDS of the form upon submit
  });

  function displayHabits() {
    let habitList = JSON.parse(localStorage.getItem("habits")) || [];

    // apply filtering ( selectedFilterPriority )
    let selectedFilterPriority = filterPrio.value;
    if (selectedFilterPriority !== "all") {
      habitList = habitList.filter(
        (habitItem) => habitItem.priority === selectedFilterPriority
      );
    }

    // apply sorting ( selectedSortOrder )
    let selectedSortOrder = sortRepetitions.value;
    if (selectedSortOrder === "ascending") {
      habitList.sort((a, b) => a.repetitions - b.repetitions);
    } else if (selectedSortOrder === "descending") {
      habitList.sort((a, b) => b.repetitions - a.repetitions);
    }

    // clear and display habitList (again) // (now without Index)
    habitsContainer.innerHTML = "";
    habitList.forEach((habitItem) => {
      let habitElement = document.createElement("div");
      habitElement.classList.add("habitItem-item");

      habitElement.innerHTML = `
				<h3>${habitItem.title}</h3>
				<p><strong>Priority:</strong> ${habitItem.priority}</p>
				<p><strong>Repetitions:</strong> <span id="reps-${habitItem.id}"> ${habitItem.repetitions}</span></p>
        <button onclick="increaseRepetitions(${habitItem.id})">+1</button> 
				<button onclick="deleteHabit(${habitItem.id})">Delete</button>
			`;
      habitsContainer.appendChild(habitElement);
    });
  }

  //
  window.increaseRepetitions = function (habitId) {
    let habitList = JSON.parse(localStorage.getItem("habits")) || [];

    let habitItem = habitList.find((h) => h.id === habitId);
    if (habitItem) {
      habitItem.repetitions++;
      localStorage.setItem("habits", JSON.stringify(habitList));
      displayHabits();
    }
  };

  window.deleteHabit = function (habitId) {
    let habitList = JSON.parse(localStorage.getItem("habits")) || [];
    habitList = habitList.filter((h) => h.id !== habitId); //remove by ID
    localStorage.setItem("habits", JSON.stringify(habitList));
    displayHabits();
  };

  // update the displayed habits whenever filtering or sorting is changed
  filterPrio.addEventListener("change", displayHabits);
  sortRepetitions.addEventListener("change", displayHabits);

  // upon initial load
  displayHabits();
});

function displayDate() {
  let date = new Date().toDateString().split(" ");
  document.getElementById(
    "date"
  ).innerHTML = `${date[0]}, ${date[2]} ${date[1]} ${date[3]}`;
}