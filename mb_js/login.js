"use strict";

const loginForm = document.querySelector(".login");

loginForm.onsubmit = function (event) {
    event.preventDefault();

    const loginData = {
        username: loginForm.username.value,
        password: loginForm.password.value
    }

    loginForm.loginButton.disabled = true;
    
    login(loginData);
}