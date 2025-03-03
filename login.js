
// function to display and hide the form 
function showModal(){
    document.querySelector(".form-bg").classList.add("show-form-bg");
    document.querySelector(".form-box").classList.add("show-form-box");
    document.querySelector(".buttons").classList.add("hide-buttons");
    document.querySelector(".right").classList.add("hide-right");
}

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

