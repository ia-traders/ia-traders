import {
    db,
    auth,
    onAuthStateChanged,
    collection,
    getDocs
} from "../firebase.js";


const ADMIN_EMAIL = "irfanali555567@gmail.com";


onAuthStateChanged(auth, async (user)=>{

    if(!user){
        location.href="login.html";
        return;
    }


    if(user.email !== ADMIN_EMAIL){

        document.body.innerHTML =
        "<h1 style='color:red;text-align:center;margin-top:50px;'>Access Denied</h1>";

        return;
    }


    loadDashboard();

});



async function loadDashboard(){


    const totalMembers =
    document.getElementById("totalMembers");


    const pendingDeposits =
    document.getElementById("pendingDeposits");


    const pendingWithdraws =
    document.getElementById("pendingWithdraws");


    const activePlans =
    document.getElementById("activePlans");


    const recentActivity =
    document.getElementById("recentActivity");



    let members = 0;
    let deposits = 0;
    let active = 0;


    let activity = "";



    const investmentSnap =
    await getDocs(
        collection(db,"investmentRequests")
    );



    const users = new Set();



    investmentSnap.forEach((doc)=>{


        const data = doc.data();



        if(data.status === "Approved"){

            if(data.uid){
                users.add(data.uid);
            }

            active++;

        }



        if(data.status === "Pending"){

            deposits++;

        }



        activity += `

        <div style="
        background:#111;
        padding:15px;
        border-radius:10px;
        margin-bottom:10px;
        ">

        <b>${data.email || "-"}</b><br>

        Plan:
        ${data.planName || data.plan || "-"}
        <br>

        Status:
        ${data.status || "-"}

        </div>

        `;


    });



    members = users.size;



    let withdraws = 0;



    const withdrawSnap =
    await getDocs(
        collection(db,"withdrawRequests")
    );



    withdrawSnap.forEach((doc)=>{


        const data = doc.data();


        if(data.status === "Pending"){

            withdraws++;

        }


    });



    totalMembers.innerHTML = members;

    pendingDeposits.innerHTML = deposits;

    pendingWithdraws.innerHTML = withdraws;

    activePlans.innerHTML = active;



    if(activity === ""){

        recentActivity.innerHTML =
        "<p style='color:#999;'>No Activity Found</p>";

    }else{

        recentActivity.innerHTML = activity;

    }



}
import { signOut } from "../firebase.js";


document.getElementById("logoutBtn").onclick = async ()=>{

    await signOut(auth);

    location.href = "login.html";

};
