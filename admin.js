import {
  db,
  collection,
  getDocs,
  doc,
  updateDoc
} from "./firebase.js";



const requestsDiv = document.getElementById("requests");


async function loadRequests(){

  const snapshot = await getDocs(
    collection(db,"investmentRequests")
  );


  requestsDiv.innerHTML = "";


  snapshot.forEach((doc)=>{

    const data = doc.data();


    requestsDiv.innerHTML += `

    <div class="request">

    <p><b>Email:</b> ${data.email}</p>

    <p><b>Plan:</b> Rs.${data.plan}</p>

    <p><b>Amount:</b> Rs.${data.amount}</p>

    <p><b>Sender Name:</b> ${data.senderName}</p>

    <p><b>Sender Number:</b> ${data.senderNumber}</p>

    <p><b>Status:</b> ${data.status}</p>

    <button>
    Approve
    </button>

    <button class="reject">
    Reject
    </button>


    </div>

    `;


  });


}


loadRequests();
