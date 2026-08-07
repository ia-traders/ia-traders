import {
    auth,
    onAuthStateChanged,
    signOut
} from "../firebase.js";


const adminEmail = document.getElementById("adminEmail");
const logoutBtn = document.getElementById("logoutBtn");


onAuthStateChanged(auth, (user)=>{


    if(!user){

        location.href = "login.html";
        return;

    }


    adminEmail.textContent = user.email;


});



logoutBtn.addEventListener("click", async()=>{


    try{


        await signOut(auth);


        location.href = "login.html";


    }catch(error){


        console.error(error);

        alert("Logout failed");


    }


});
