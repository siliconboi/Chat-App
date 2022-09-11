const token = window.sessionStorage.getItem("jwt");
if(!token){
    window.location.assign("./index.html");
}
else{
    const submitButton = document.getElementById("submit");
    const signOutButton = document.getElementById("signout");
    const userlist = document.getElementById("userlist");
    const msg = document.getElementById("msgbox");
    const msgarea = document.getElementById("msgarea");
    
const socket = io("http://localhost:3000",{
    query:{
       token: token //sending token socket as part of handshake query
    }
});

socket.on("connect",()=>{
});

let emailMap=new Map();//a map to store socketid with respective email ids

socket.on("users", (users)=>{
for(index in users){
    const option = document.createElement("option");
    option.text = users[index].name;
    option.value = users[index].userID;
    userlist.add(option); //dynamically adding options to select list in document
    emailMap.set(users[index].email,users[index].userID);
}
});

socket.on("new user connected", ({email, newSocketID})=>{//updating the emailMap with their new socketid when a new user connects
for(index in userlist.options){
    if(email==getKey(emailMap, userlist.options[index].value)){
        userlist.options[index].value=newSocketID;
    }
}
emailMap.set(email, newSocketID);
});

function getKey(map, searchValue) {// function to retrieve a key from a given value in the map
    for (let [key, value] of map.entries()) {
      if (value === searchValue)
        return key;
    }
  }

  userlist.addEventListener('change', ()=>{ // eventlistener to trigger whenever we select a new account from select list
    msgarea.innerHTML="";
    socket.emit("allChat", {
     from: getKey(emailMap, userlist.value),
     to: getKey(emailMap,socket.id)
    });
})

socket.on("allChat", (msgs)=>{
for(index in msgs){
    if(msgs[index].from==getKey(emailMap, socket.id)){
        msgarea.innerHTML+=`<p id ="self">${msgs[index].message}</p>`;//adding self id to identify which msg came from logged in user
    }
    if(msgs[index].from==getKey(emailMap, userlist.value)){
        msgarea.innerHTML+=`<p id="others">${msgs[index].message}</p>`;
    }
}
});

submitButton.addEventListener('click', async ()=>{
    if((userlist.value!=socket.id) && userlist.value && msg.value){
    socket.emit("private message", {//sending msg to register in server
        msg: msg.value,
        to:{   
        socketid: userlist.value,
        email: getKey(emailMap,userlist.value)
        }
    });
    msgarea.innerHTML+=`<p id="self">${msg.value}</p>`;
}
})

socket.on("private message", ({msg, from})=>{
    console.log(userlist.value);
    console.log(from);
    if(userlist.value==from){
        msgarea.innerHTML+=`<p id="others">${msg}</p>`; //retrieving message sent from another user in real time
    }
});

signOutButton.addEventListener('click', ()=>{
    socket.disconnect();
    window.sessionStorage.removeItem("jwt");
    window.location.assign("./index.html");
})
}