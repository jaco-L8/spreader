// Description: Password protection for GitHub pages

// Check if password has already been entered in this session
if (sessionStorage.getItem("passwordEntered")) {
    // Password has already been entered, do nothing
} else {
    // Password has not been entered in this session, prompt for it
    var password = prompt("Please enter the password to access this page:");
    if (password === "TestPass" || password === "Peechat") {
        // Password is correct, set flag in sessionStorage
        sessionStorage.setItem("passwordEntered", true);
    } else {
        // Password is incorrect, redirect to current page
        window.location.href = window.location.href;
    }
}