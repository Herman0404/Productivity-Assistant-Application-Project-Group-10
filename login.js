
// function to display the form 
function showModal(){
  document.querySelector(".form-bg").classList.add("show-form-bg");
  document.querySelector(".form-box").classList.add("show-form-box");
  document.querySelector(".buttons").classList.add("hide-buttons");
  document.querySelector(".right").classList.add("hide-right");
}

// function to hide the form
function hideModal(){
  document.querySelector(".form-bg").classList.remove("show-form-bg");
  document.querySelector(".form-box").classList.remove("show-form-box");
  document.querySelector(".buttons").classList.remove("hide-buttons");
  document.querySelector(".right").classList.remove("hide-right");
}


// select buttons and fields
let signUpBtns = document.querySelectorAll(".signupbtn, .getstarted, .signup"); //All signup buttons
let logInBtns = document.querySelectorAll(".log-in-btn"); //All login buttons
let loginBtn = document.querySelector(".loginbtn"); //single login button inside the form

let nameField1 = document.querySelector(".nameField");
let confirmPwdField = document.querySelector(".confirmPwd");
let title = document.querySelector(".title");
let underline = document.querySelector(".underline");

const handleClickLogin = () => {

 

  //switch UI to login form    
  nameField1.style.maxHeight="0";
  confirmPwdField.style.maxHeight="0";
  title.innerHTML = "Log In";

  signUpBtns.forEach(button => {
      button.classList.add("disable");
});
  loginBtn.classList.remove("disable")
  underline.style.transform = "translateX(35px)";
  
};

// Attach the event listener to each button
logInBtns.forEach(button => {
  button.addEventListener("click", handleClickLogin);
});



const handleClickSignup = () =>  {

    
  
  // switch UI to signup form
  nameField1.style.maxHeight="60px";
  confirmPwdField.style.maxHeight="60px";
  title.innerHTML = "Sign Up";

  signUpBtns.forEach(button => {
      button.classList.remove("disable");
});

  loginBtn.classList.add("disable")
  underline.style.transform = "translateX(0)";
  
};
// Attach the event listener to each button
signUpBtns.forEach(button => {
  button.addEventListener("click", handleClickSignup);
});

//the above functions were just to display the form field 

// now lets start with save user to localstorage

const handleSignup = () => {
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let confirmPassword = document.getElementById("confirm-password").value.trim();

  // Step 1: Check if fields are empty (Basic Check)
  if (!name || !email || !password || !confirmPassword) {
      alert("All fields are required!");
      return;
  }

  // Step 2: Ensure passwords match
  if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
  }

  // Step 3: Get existing users from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Step 4: Check if the email is already registered
  let existingUser = users.find(user => user.email === email);
  if (existingUser) {
      alert("User already exists! Please log in.");
      document.querySelector(".sign-in-form").reset();
      return;
  }

  // Step 5: Save new user
  let newUser = {
      name: name,
      email: email,
      password: password,
      tasks: [], // Empty task list for each user
      events: [],
      habits: []
  };
  
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Step 6: Store session & redirect to homepage
  localStorage.setItem("currentUser", JSON.stringify(newUser));
  document.querySelector(".sign-in-form").reset();
 
  window.location.href = "index.html"; // Change this to your actual homepage
  
  
};

// Attach signup event listener to signup button
document.querySelector(".signupbtn").addEventListener("click", handleSignup);

// storing login to local storage

const handleLogin = () => {
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  // Step 1: Check if fields are empty
  if (!email || !password) {
      alert("Email and Password are required!");
      return;
  }

  // Step 2: Get users from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Step 3: Find the user in the database
  let foundUser = users.find(user => user.email === email && user.password === password);

  if (!foundUser) {
      alert("Invalid email or password!");
      document.querySelector(".sign-in-form").reset(); // Clear form
      return;
  }

  // Step 4: Store session & redirect to homepage
  localStorage.setItem("currentUser", JSON.stringify(foundUser));
  document.querySelector(".sign-in-form").reset(); // Clear form

  window.location.href = "index.html"; // Change this to your actual homepage
};

// Attach login event listener to login button
document.querySelector(".loginbtn").addEventListener("click", handleLogin);