import {
  db,
  auth,
  onAuthStateChanged,
  collection,
  getDocs,
  doc,
  updateDoc
} from "../firebase.js";

const requestsDiv = document.getElementById("requests");

const ADMIN_EMAIL = "irfanali555567@gmail.com";

onAuthStateChanged(auth, (user) => {

  if (!user) {
    location.href = "login.html";
    return;
  }

  if (user.email !== ADMIN_EMAIL) {
    document.body.innerHTML =
      "<h1 style='color:red;text-align:center;margin-top:50px;'>Access Denied</h1>";
    return;
  }

  loadRequests();

});

async function loadRequests() {

  requestsDiv.innerHTML = `
  <h2 style="color:gold;">Investment Requests</h2>
  `;

  const investmentSnapshot = await getDocs(
    collection(db, "investmentRequests")
  );

  investmentSnapshot.forEach((item) => {

    const data = item.data();

    requestsDiv.innerHTML += `

    <div class="request">

      <h3 style="color:gold;">Investment Request</h3>

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

  });  // ==========================
  // Withdraw Requests
  // ==========================

  requestsDiv.innerHTML += `
    <hr style="margin:40px 0;border-color:gold;">
    <h2 style="color:#2ecc71;">Withdraw Requests</h2>
  `;

  const withdrawSnapshot = await getDocs(
    collection(db, "withdrawRequests")
  );

  withdrawSnapshot.forEach((item) => {

    const data = item.data();

    requestsDiv.innerHTML += `

    <div class="request">

      <h3 style="color:#2ecc71;">Withdraw Request</h3>

      <p><b>Email:</b> ${data.email}</p>

      <p><b>Amount:</b> Rs.${data.amount}</p>

      <p><b>Payment Method:</b> ${data.paymentMethod}</p>

      <p><b>Account:</b> ${data.account}</p>

      <p><b>Status:</b> ${data.status}</p>

      <button onclick="approveWithdraw('${item.id}')">
        Approve
      </button>

      <button class="reject" onclick="rejectWithdraw('${item.id}')">
        Reject
      </button>

    </div>

    `;

  });

}// =====================================
// Investment Approve
// =====================================

window.approveRequest = async function(id){

  await updateDoc(
    doc(db, "investmentRequests", id),
    {
      status: "Approved"
    }
  );

  alert("Investment Approved");

  loadRequests();

};


// =====================================
// Investment Reject
// =====================================

window.rejectRequest = async function(id){

  await updateDoc(
    doc(db, "investmentRequests", id),
    {
      status: "Rejected"
    }
  );

  alert("Investment Rejected");

  loadRequests();

};// =====================================
// Withdraw Approve
// =====================================

window.approveWithdraw = async function(id){

  await updateDoc(
    doc(db, "withdrawRequests", id),
    {
      status: "Approved"
    }
  );

  alert("Withdraw Approved");

  loadRequests();

};


// =====================================
// Withdraw Reject
// =====================================

window.rejectWithdraw = async function(id){

  await updateDoc(
    doc(db, "withdrawRequests", id),
    {
      status: "Rejected"
    }
  );

  alert("Withdraw Rejected");

  loadRequests();

};
