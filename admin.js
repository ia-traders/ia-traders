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
    collection(db, "investmentRequests")
  );


  requestsDiv.innerHTML = "";


  snapshot.forEach((item)=>{

    const data = item.data();


    requestsDiv.innerHTML += `

    <div class="request">

      <p><b>Email:</b> ${data.email}</p>

      <p><b>Plan:</b> Rs.${data.plan}</p>

      <p><b>Amount:</b> Rs.${data.amount}</p>

      <p><b>Sender Name:</b> ${data.senderName}</p>

      <p><b>Sender Number:</b> ${data.senderNumber}</p>

      <p><b>Status:</b> ${data.status}</p>


      <button onclick="approveRequest('${item.id}')">
      Approve
      </button>


      <button class="reject" onclick="rejectRequest('${item.id}')">
      Reject
      </button>


    </div>

    `;

  });

}


window.approveRequest = async function(id){

  await updateDoc(
    doc(db,"investmentRequests",id),
    {
      status:"Approved"
    }
  );

  alert("Request Approved");

  loadRequests();

}



window.rejectRequest = async function(id){

  await updateDoc(
    doc(db,"investmentRequests",id),
    {
      status:"Rejected"
    }
  );

  alert("Request Rejected");

  loadRequests();

}



loadRequests();
