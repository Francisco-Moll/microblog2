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
                    const currentUserLike = post.likes.find(like => like.username === loginData.username);
                    const hasLike = currentUserLike ? true : false;
                    const likeId = currentUserLike ? currentUserLike._id : "";
                    
                    const postElement = document.createElement("div");
                    postElement.className = "post";
                    postElement.innerHTML = `
                    <div class="block">
                        <h2><a href="../mb_pages/profile.html?${post.username}">${post.username}</a></h2>
                        <p>${post.text}</p>
                        <button class="like-button" data-post-id="${post._id}" data-has-like="${hasLike}" data-like-id="${likeId}">Like (${post.likes.length})</button>
                    </div>
                    `;
                    postsSection.appendChild(postElement);
                });

                // Add event listeners to like buttons
                const likeButtons = document.querySelectorAll(".like-button");
                likeButtons.forEach(button => {
                    button.addEventListener("click", function () {
                        const postId = this.getAttribute("data-post-id");
                        const hasLike = this.getAttribute("data-has-like") === "true";
                        const likeId = this.getAttribute("data-like-id");
                        likePost(postId, hasLike, likeId);
                    });
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

    // Like or unlike a post
    function likePost(postId, hasLike, likeId) {
        const loginData = getLoginData();
        if (!loginData.token) {
            console.error("No authorization token found.");
            alert("You must be logged in to like a post.");
            return;
        }

        if (hasLike) {
            // Unlike the post
            fetch(apiBaseURL + `/api/likes/${likeId}`, {
                method: "DELETE",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loginData.token}`
                }
            })
                .then(response => {
                    if (response.ok) {
                        console.log("Post unliked successfully.");
                        fetchPosts(); // Refresh the posts
                    } else {
                        return response.json().then(error => {
                            throw new Error(error.message);
                        });
                    }
                })
                .catch(error => {
                    console.error("Error unliking post:", error);
                    alert("Failed to unlike post.");
                });
        } else {
            // Like the post
            fetch(apiBaseURL + `/api/likes`, {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loginData.token}`
                },
                body: JSON.stringify({
                    postId: postId
                })
            })
                .then(response => {
                    if (response.ok) {
                        console.log("Post liked successfully.");
                        fetchPosts(); // Refresh the posts
                    } else {
                        return response.json().then(error => {
                            throw new Error(error.message);
                        });
                    }
                })
                .catch(error => {
                    console.error("Error liking post:", error);
                    alert("Failed to like post.");
                });
        }
    }

    // Event listener for the submit button
    submitButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent form submission
        postMessage();
    });

    fetchPosts();
});