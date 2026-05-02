const API = "http://localhost:5000/api";

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

    const data = await res.json();

    localStorage.setItem("user", JSON.stringify(data));
}