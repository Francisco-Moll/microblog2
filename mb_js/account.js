"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";
    const loginData = getLoginData(); // Assume getLoginData is defined in auth.js

    if (!loginData.token) {
        console.error("No authorization token found.");
        window.location.replace("../mb_index.html");
        return;
    }

    // Elements
    const fullNameInput = document.getElementById("fullName");
    const bioInput = document.getElementById("bio");
    const passwordInput = document.getElementById("password");
    const updateButton = document.getElementById("updateButton");

    // Fetch user details
    function fetchUserDetails() {
        fetch(apiBaseURL + "/api/users/me", {
            headers: {
                "Authorization": `Bearer ${loginData.token}`
            }
        })
        .then(response => response.json())
        .then(user => {
            fullNameInput.value = user.fullName || "";
            bioInput.value = user.bio || "";
        })
        .catch(error => {
            console.error("Error fetching user details:", error);
        });
    }

    // Update user details
    function updateUserDetails(event) {
        event.preventDefault();

        const updatedUser = {
            fullName: fullNameInput.value.trim(),
            bio: bioInput.value.trim(),
            password: passwordInput.value.trim()
        };

        fetch(apiBaseURL + "/api/users/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${loginData.token}`
            },
            body: JSON.stringify(updatedUser)
        })
        .then(response => response.json())
        .then(data => {
            console.log("User updated successfully:", data);
            alert("Profile updated successfully!");
        })
        .catch(error => {
            console.error("Error updating user details:", error);
            alert("Failed to update profile.");
        });
    }

    // Initialize
    fetchUserDetails();
    updateButton.addEventListener("click", updateUserDetails);
});