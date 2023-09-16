// Description: Password protection for GitHub pages
        var password = prompt("Please enter the password to access this page:");
        if (password != "boinger") {
            alert("Incorrect password. Access denied.");
            window.location.href = "https://github.com/"; // Redirect to GitHub homepage
        }
