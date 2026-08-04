import {
  db,
  auth,
  onAuthStateChanged,
  collection,
  getDocs
} from "../firebase.js";

const historyDiv = document.getElementById("history");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    historyDiv.innerHTML = "<h2>Please login first.</h2>";
    return;
  }

  const snapshot = await getDocs(collection(db, "investmentRequests"));

  let html = "";

  snapshot.forEach((item) => {

    const data = item.data();

    if (data.uid !== user.uid) return;

    let statusColor = "#f1c40f";
    let statusIcon = "🟡";

    if (data.status === "Approved") {
      statusColor = "#2ecc71";
      statusIcon = "🟢";
    } else if (data.status === "Rejected") {
      statusColor = "#e74c3c";
      statusIcon = "🔴";
    }

    let investmentDate = "Not Available";

    if (data.createdAt) {
      investmentDate = data.createdAt.toDate().toLocaleString();
    }

    html += `
      <div class="card">

        <h2 style="color:gold;">Deposit</h2>

        <p><b>Investment:</b> Rs.${data.amount}</p>

        <p><b>Plan:</b> Rs.${data.plan}</p>

        <p><b>Payment Method:</b> ${data.paymentMethod}</p>

        <p><b>Date:</b> ${investmentDate}</p>

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
    html = "<h2>No Deposit History Found.</h2>";
  }

  historyDiv.innerHTML = html;

});
