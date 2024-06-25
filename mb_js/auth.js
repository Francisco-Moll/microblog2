"use strict";

const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";

// You can use this function to get the login data of the logged-in user (if any).
function getLoginData() {
    const loginJSON = window.localStorage.getItem("login-data");
    return JSON.parse(loginJSON) || {};
}

// You can use this function to see whether the current visitor is logged in.
function isLoggedIn() {
    const loginData = getLoginData();
    return Boolean(loginData.token);
}

function login(loginData) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    };

    return fetch(apiBaseURL + "/auth/login", options)
        .then(response => response.json())
        .then(loginData => {
            if (loginData.hasOwnProperty("message")) {
                console.error(loginData);
                displayLoginError(loginData.message);
                return null;
            }

            window.localStorage.setItem("login-data", JSON.stringify(loginData));
            window.location.assign("../mb_pages/posts.html");  // redirect

            return loginData;
        })
        .catch(error => {
            console.error("Network or server error:", error);
            displayLoginError("Unable to connect.");
        });
}
function displayLoginError(message) {
    const errorElement = document.getElementById("login-error");
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function registerUser(signupData) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
    };

    return fetch(apiBaseURL + "/auth/register", options)
        .then(response => response.json())
        .then(registerData => {
            if (registerData.hasOwnProperty("message")) {
                console.error(registerData);
                displayRegistrationError(registerData.message);
                return null;
            }

            console.log("User registered successfully:", registerData);
            return registerData;
        })
        .catch(error => {
            console.error("Network or server error:", error);
            displayRegistrationError("Unable to connect.");
        });
}
function displayRegistrationError(message) {
    const errorElement = document.getElementById("registration-error");
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}