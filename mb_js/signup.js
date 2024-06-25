"use strict";

const signupForm = document.querySelector(".signup");

signupForm.onsubmit = function (event) {
    event.preventDefault();

    const signupData = {
        username: signupForm.username.value,
        fullName: signupForm.fullname.value,
        password: signupForm.password.value
    }

    signupForm.signupButton.disabled = true;
    
    registerUser(signupData);
}