"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";
    const postsSection = document.querySelector("#posts");
    const messageTextarea = document.getElementById("message");
    const submitButton = document.querySelector(".submitbutton input[type='submit']");

    // Fetch and display posts
    function fetchPosts() {
        const loginData = getLoginData();
        if (!loginData.token) {
            console.error("No authorization token found.");
            postsSection.innerHTML = '<p>Please log in to view posts.</p>';
            return;
        }

        fetch(apiBaseURL + "/api/posts", {
            headers: {
                "Authorization": `Bearer ${loginData.token}`
            }
        })
            .then(response => response.json())
            .then(posts => {
                postsSection.innerHTML = '';
                posts.forEach(post => {
                    const postElement = document.createElement("div");
                    postElement.className = "post";
                    postElement.innerHTML = `
                    <div class="block">
                        <h2>${post.username}</h2>
                        <p>${post.text}</p>
                    </div>
                    `;
                    postsSection.appendChild(postElement);
                });
            })
            .catch(error => {
                console.error("Error fetching posts:", error);
                postsSection.innerHTML = '<p>Failed to load posts.</p>';
            });
    }

    // Post a new message
    function postMessage() {
        const loginData = getLoginData(); // Retrieve login data
        if (!loginData.token) {
            console.error("No authorization token found.");
            alert("You must be logged in to post a message.");
            return;
        }

        const message = messageTextarea.value.trim();
        if (!message) {
            alert("Message cannot be empty.");
            return;
        }

        const postData = {
            text: message
        };

        fetch(apiBaseURL + "/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${loginData.token}`
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(post => {
            console.log("Post created successfully:", post);
            messageTextarea.value = ''; // Clear the textarea
            fetchPosts(); // Refresh the posts
        })
        .catch(error => {
            console.error("Error posting message:", error);
            alert("Failed to post message.");
        });
    }
    // Event listener for the submit button
    submitButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent form submission
        postMessage();
    });

    fetchPosts();
});

