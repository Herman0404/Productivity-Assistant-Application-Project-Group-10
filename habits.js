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
  let habitsContainer = document.getElementById("habit-list");
  let filterPrio = document.getElementById("filter-priority");
  // sorting: 
  let sortRepetitions = document.getElementById("sort-repetitions");
  let sortPriority = document.getElementById("sort-priority");
  

  habitForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
          window.location.href = "login.html"; // Redirect if not logged in
          return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];
      let userData = users.find(user => user.email === currentUser.email);
      if (!userData) return;

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

    userData.habits.push(habitItem);
    //save the habits array to local storage - local storage does not accept 'objects', so it's converted into a string (.stringify)
    saveUserEvents(users)

    displayHabits();    //re-display habits list as soon as a new task is added
    habitForm.reset(); // clears the fields of the form upon submit
  });


  function displayHabits() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = "login.html"; // Redirect if not logged in
        return;
    }
    
    // Retrieve users and find the current user's data
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userData = users.find(user => user.email === currentUser.email);
    let habitList = userData ? userData.habits : [];

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
      let habitElement = document.createElement("li");
      habitElement.classList.add("habit-item");

          // decreaseRepetitions function 
      habitElement.innerHTML = `
				<h3>${habitItem.title}</h3>
				<p><strong>Priority:</strong> ${habitItem.priority}</p>
				<p><strong>Repetitions:</strong> <span id="reps-${habitItem.id}"> ${habitItem.repetitions}</span></p>
        <div class="habit-actions">
          <button class="repetion-button" onclick="decreaseRepetitions(${habitItem.id})">-1</button> 
          <button class="repetion-button" onclick="increaseRepetitions(${habitItem.id})">+1</button>
          <button class="delete-btn" onclick="deleteHabit(${habitItem.id})">Remove habit</button> 
        </div>
				
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
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = "login.html"; // Redirect if not logged in
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userData = users.find(user => user.email === currentUser.email);
    if (!userData) return;
    let habitItem = userData.habits.find((h) => h.id === habitId);
    if (habitItem) {
      habitItem.repetitions++;
      saveUserEvents(users)
      displayHabits();
    }
  };

  // function for decreasing repetition count if needed //
  window.decreaseRepetitions = function (habitId) {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = "login.html"; // Redirect if not logged in
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userData = users.find(user => user.email === currentUser.email);
    if (!userData) return;
    let habitItem = userData.habits.find((h) => h.id === habitId);
    if (habitItem) {
      if(habitItem.repetitions > 0){
        habitItem.repetitions--;
      saveUserEvents(users)
      displayHabits();
      } 
    }
  };

  // function to delete a task
  window.deleteHabit = function (habitId) {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = "login.html"; // Redirect if not logged in
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userData = users.find(user => user.email === currentUser.email);

    if (!userData) return;
    const habitToDelete = userData.habits.find((h) => h.id === habitId);
    if(habitToDelete && window.confirm(`Are you sure you want to delete "${habitToDelete.title}"?`)){
      userData.habits = userData.habits.filter((h) => h.id !== habitId); // Remove by ID
    }
    
    saveUserEvents(users)
    displayHabits();
  };

  // update the displayed habits whenever filtering or sorting is changed, rather than having a button to apply filters onclick
  filterPrio.addEventListener("change", displayHabits);
  sortRepetitions.addEventListener("change", displayHabits);
  sortPriority.addEventListener("change", displayHabits);

  // upon initial load
  displayHabits();
});

function saveUserEvents(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// display current date and time just because
function displayDate() {
  let date = new Date().toDateString().split(" ");
  document.getElementById(
    "date"
  ).innerHTML = `${date[0]}, ${date[2]} ${date[1]} ${date[3]}`;
}
