const API = "http://localhost:5000/api";

// REGISTER
async function registerUser(data){
    await fetch(`${API}/auth/register`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(data)
    });
}

// LOGIN
async function loginUser(data){
    const res = await fetch(`${API}/auth/login`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    localStorage.setItem("user", JSON.stringify(result.user));
    localStorage.setItem("token", result.token);
}

// ADD XP
async function addXP(xp){
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch(`${API}/progress/addXP`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
            userId: user._id,
            xp: xp
        })
    });

    const updated = await res.json();
    localStorage.setItem("user", JSON.stringify(updated));
}