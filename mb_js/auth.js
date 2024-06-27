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

// Login Existing User
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

//Register User
function registerUser(signupData) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
        },
        body: JSON.stringify(signupData),
    };

    return fetch(apiBaseURL + "/api/users", options)
        .then(response => response.json())
        .then(registerData => {
            if (registerData.hasOwnProperty("message")) {
                console.error(registerData);
                displayRegistrationError(registerData.message);
                return null;
            }

            console.log("User registered successfully:", registerData);

            window.localStorage.setItem("login-data", JSON.stringify(registerData));
            window.location.assign("../mb_pages/posts.html"); // redirect

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

// Logout User
function logout () {
    const loginData = getLoginData();

    // GET /auth/logout
    const options = { 
        method: "GET",
        headers: { 
            // This header is how we authenticate our user with the
            // server for any API requests which require the user
            // to be logged-in in order to have access.
            // In the API docs, these endpoints display a lock icon.
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(apiBaseURL + "/auth/logout", options)
        .then(response => response.json())
        .then(data => console.log(data))
        .finally(() => {
            // We're using `finally()` so that we will continue with the
            // browser side of logging out (below) even if there is an 
            // error with the fetch request above.

            window.localStorage.removeItem("login-data");  // remove login data from LocalStorage
            window.location.assign("../mb_index.html");  // redirect back to landing page
        });
}

// Add logout button if user is logged in
document.addEventListener("DOMContentLoaded", function () {
    if (isLoggedIn()) {
        const nav = document.querySelector("nav ul");
        const logoutButton = document.createElement("li");
        logoutButton.innerHTML = '<a href="../mb_index.html" id="logoutButton">Logout</a>';
        nav.appendChild(logoutButton);

        document.getElementById("logoutButton").addEventListener("click", function (event) {
            event.preventDefault();
            logout();
        });
    }
    if (isLoggedIn()) {
        const nav = document.querySelector(".menubar ul");
        const logoutButton = document.createElement("li");
        logoutButton.innerHTML = '<a href="../mb_index.html" id="logoutButton">Logout</a>';
        nav.appendChild(logoutButton);

        document.getElementById("logoutButton").addEventListener("click", function (event) {
            event.preventDefault();
            logout();
        });
    }
});