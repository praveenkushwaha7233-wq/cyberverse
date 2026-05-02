async function loadUsers(){
    const res = await fetch("http://localhost:5000/api/users");
    const users = await res.json();

    let table = document.getElementById("userTable");
    table.innerHTML = "";

    users.forEach(u=>{
        table.innerHTML += `
        <tr>
            <td>${u.name}</td>
            <td>${u.xp}</td>
            <td>${u.level}</td>
        </tr>`;
    });
}

loadUsers();
async function addLab(){  
  await fetch("http://localhost:5000/api/labs",{  
    method:"POST",  
    headers:{ "Content-Type":"application/json" },  
    body: JSON.stringify({  
      title:"SQL Injection Lab",  
      description:"Exploit login bypass",  
      xp:100,  
      difficulty:"Medium"  
    })  
  });

  alert("Lab Added");
}