"use strict";

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");

    const profileDetails = document.querySelector("#profileDetails");
    if (username) {
        const profile = await fetchProfileDetails(username);
        displayProfileDetails(profile);
    } else {
        profileDetails.innerHTML = `
        <div class=" block error">
            <p>No username provided in URL.</p>
        </div>    
        `;
    }

    async function fetchProfileDetails(username) {
        const loginData = getLoginData(); // Retrieve login data
        if (!loginData || !loginData.token) {
            console.error("No authorization token found.");
            alert("You must be logged in to view profiles.");
            return;
        }

        try {
            const response = await fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/${username}`, {
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loginData.token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error("Error fetching profile details:", error);
            alert("Failed to fetch profile details. Please try again later.");
        }
    }

    function displayProfileDetails(profile) {
        if (profile) {
            profileDetails.innerHTML = `
                <div class="profile">
                    <h1>${profile.username}</h1>
                    <p>${profile.fullName}</p>
                    <p>${profile.bio}</p>
                </div>
            `;
        } else {
            profileDetails.innerHTML = "<p>Profile not found.</p>";
        }
    }
});