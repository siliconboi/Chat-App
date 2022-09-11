const token = window.sessionStorage.getItem("jwt");
if(token){
    window.location.assign("./chatlist.html");
}
else{
    const loginButton = document.getElementById("login");
    const registerButton = document.getElementById("register");
    registerButton.addEventListener('click', async ()=>{
        const data = {
        name : document.getElementById("name").value,
        email : document.getElementById("email").value,
        password : document.getElementById("password").value
        };
        const res = await fetch('user/api/register',{
            method: "POST",
            body: JSON.stringify(data),
            headers:{
                "Content-Type": "application/json"
            }
        });
        const authHeader = await res.json();
        if(authHeader){
            window.sessionStorage.setItem("jwt", authHeader.token);
            window.location.assign("./chatlist.html");
        }
        return false;
        
    });
    loginButton.addEventListener('click', async ()=>{
        const data = {
            email : document.getElementById("email").value,
            password : document.getElementById("password").value
        };
        const res = await fetch('user/api/login',{
            method: "POST",
            body: JSON.stringify(data),
            headers:{
                "Content-Type": "application/json"
            }
        });
        const authHeader = await res.json();
        if(authHeader){
            window.sessionStorage.setItem("jwt", authHeader.token);
            window.location.assign("./chatlist.html");
        }
        return false;
    });
}