"use strict";

const signupForm = document.querySelector(".signup");

signupForm.onsubmit = function (event) {
    event.preventDefault();

    const password = signupForm.password.value;
    const confPassword = signupForm.conf_password.value;
    const errorMessage = document.getElementById('error-message');

    if (password !== confPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        return;
    } else {
        errorMessage.textContent = '';
    }

    const signupData = {
        username: signupForm.username.value,
        fullName: signupForm.fullname.value,
        password: signupForm.password.value
    }

    signupForm.signupButton.disabled = true;
    
    registerUser(signupData);
}