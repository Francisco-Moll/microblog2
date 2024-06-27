"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";
    const postsSection = document.querySelector("#posts");

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

    fetchPosts();
});