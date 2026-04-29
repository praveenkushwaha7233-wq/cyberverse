function registerUser() {
    let username = prompt("Enter username");
    let password = prompt("Enter password");

    fetch('/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `username=${username}&password=${password}`
    })
    .then(() => {
        alert("Registered! Now login.");
        window.location.href = "/login";
    });
}