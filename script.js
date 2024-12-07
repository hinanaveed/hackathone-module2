// Helper Functions
function setGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let greeting = "Good Night";
    if (hours >= 6 && hours < 12) greeting = "Good Morning";
    else if (hours >= 12 && hours < 18) greeting = "Good Afternoon";
    else if (hours >= 18) greeting = "Good Evening";
    return greeting;
}

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || null;
}

function validateSignupForm() {
    const firstName = document.querySelector("#first-name").value.trim();
    const lastName = document.querySelector("#last-name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();
    const repeatPassword = document.querySelector("#repeat-password").value.trim();

    if (firstName.length < 3 || firstName.length > 20) {
        alert("First name must be between 3 and 20 characters.");
        return false;
    }
    if (lastName.length < 1 || lastName.length > 20) {
        alert("Last name must be between 1 and 20 characters.");
        return false;
    }
    if (!email.includes("@")) {
        alert("Please enter a valid email.");
        return false;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
        alert("Password must be at least 8 characters, include uppercase and lowercase letters.");
        return false;
    }
    if (password !== repeatPassword) {
        alert("Passwords do not match.");
        return false;
    }
    return true;
}

// Signup Handler
function handleSignup(event) {
    event.preventDefault();
    if (validateSignupForm()) {
        const user = {
            firstName: document.querySelector("#first-name").value.trim(),
            lastName: document.querySelector("#last-name").value.trim(),
            email: document.querySelector("#email").value.trim(),
            password: document.querySelector("#password").value.trim(),
        };
        saveToLocalStorage("user", user);
        alert("Signup successful!");
        window.location.href = "login.html";
    }
}

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    const email = document.querySelector("#login-email").value.trim();
    const password = document.querySelector("#login-password").value.trim();
    const user = getFromLocalStorage("user");

    if (user && user.email === email && user.password === password) {
        saveToLocalStorage("loggedInUser", user);
        alert("Login successful!");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid email or password.");
    }
}

// Logout Handler
function handleLogout() {
    localStorage.removeItem("loggedInUser");
    alert("You have logged out.");
    window.location.href = "index.html";
}

// Add additional event listeners and blog logic as needed


// Handle New Blog
function handleNewBlog(event) {
    event.preventDefault();
    const user = getFromLocalStorage("loggedInUser");
    const title = document.querySelector("#blog-title").value.trim();
    const body = document.querySelector("#blog-body").value.trim();

    if (title.length < 5 || title.length > 50) {
        alert("Title must be between 5 and 50 characters.");
        return;
    }
    if (body.length < 100 || body.length > 3000) {
        alert("Body must be between 100 and 3000 characters.");
        return;
    }

    const blog = {
        id: Date.now(),
        title,
        body,
        author: `${user.firstName} ${user.lastName}`,
        date: new Date().toLocaleString(),
    };

    let blogs = getFromLocalStorage("blogs") || [];
    blogs.push(blog);
    saveToLocalStorage("blogs", blogs);

    alert("Blog posted successfully!");
    document.querySelector("#blog-form").reset();
    displayUserBlogs();
}

// Display User Blogs
function displayUserBlogs() {
    const user = getFromLocalStorage("loggedInUser");
    const blogs = getFromLocalStorage("blogs") || [];
    const userBlogs = blogs.filter(blog => blog.author === `${user.firstName} ${user.lastName}`);
    const blogsContainer = document.querySelector("#user-blogs");

    blogsContainer.innerHTML = userBlogs
        .map(
            blog => `
        <div class="blog">
            <h3>${blog.title}</h3>
            <p>${blog.body}</p>
            <p><small>Published on ${blog.date}</small></p>
            <button class="delete" onclick="deleteBlog(${blog.id})">Delete</button>
        </div>
    `
        )
        .join("");
}

// Delete Blog
function deleteBlog(id) {
    if (confirm("Are you sure you want to delete this blog?")) {
        let blogs = getFromLocalStorage("blogs") || [];
        blogs = blogs.filter(blog => blog.id !== id);
        saveToLocalStorage("blogs", blogs);
        displayUserBlogs();
    }
}

// Display All Blogs
function displayAllBlogs() {
    const blogs = getFromLocalStorage("blogs") || [];
    const blogsContainer = document.querySelector("#all-blogs");

    blogsContainer.innerHTML = blogs
        .map(
            blog => `
        <div class="blog">
            <h3>${blog.title}</h3>
            <p>${blog.body}</p>
            <p><small>By ${blog.author} on ${blog.date}</small></p>
        </div>
    `
        )
        .join("");
}

// Profile Update
function handleProfileUpdate(event) {
    event.preventDefault();
    const user = getFromLocalStorage("loggedInUser");
    user.firstName = document.querySelector("#update-first-name").value.trim();
    user.lastName = document.querySelector("#update-last-name").value.trim();
    user.password = document.querySelector("#update-password").value.trim();
    saveToLocalStorage("loggedInUser", user);
    saveToLocalStorage("user", user);
    alert("Profile updated successfully!");
}