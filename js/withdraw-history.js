import {
  db,
  auth,
  onAuthStateChanged,
  collection,
  getDocs
} from "../firebase.js";

const withdrawHistory = document.getElementById("withdrawHistory");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    withdrawHistory.innerHTML = "<h2>Please login first.</h2>";
    return;
  }

  const snapshot = await getDocs(collection(db, "withdrawRequests"));

  let html = "";

  snapshot.forEach((item) => {

    const data = item.data();

    if (data.uid !== user.uid) return;


    let statusColor = "#f1c40f";
    let statusIcon = "🟡";


    if (data.status === "Approved") {
      statusColor = "#2ecc71";
      statusIcon = "🟢";
    } 
    else if (data.status === "Rejected") {
      statusColor = "#e74c3c";
      statusIcon = "🔴";
    }


    let withdrawDate = "Not Available";

    if (data.createdAt) {
      withdrawDate = data.createdAt.toDate().toLocaleString();
    }


    html += `

    <div class="card">

      <h2 style="color:gold;">Withdraw Request</h2>

      <p><b>Amount:</b> Rs.${data.amount}</p>

      <p><b>Payment Method:</b> ${data.paymentMethod || "N/A"}</p>

      <p><b>Account:</b> ${data.account || "N/A"}</p>

      <p><b>Date:</b> ${withdrawDate}</p>

      <p>
        <b>Status:</b>
        <span style="color:${statusColor};font-weight:bold;">
          ${statusIcon} ${data.status}
        </span>
      </p>

    </div>

    `;

  });


  if (html === "") {
    html = "<h2>No Withdraw History Found.</h2>";
  }


  withdrawHistory.innerHTML = html;


});
