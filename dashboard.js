import {
  db,
  auth,
  onAuthStateChanged,
  collection,
  getDocs
} from "./firebase.js";

const userData = document.getElementById("userData");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    userData.innerHTML = "<h2>Please login first.</h2>";
    return;
  }

  const snapshot = await getDocs(collection(db, "investmentRequests"));

  let html = "";

  snapshot.forEach((item) => {

    const data = item.data();

    if (data.uid === user.uid) {

      let statusColor = "#f1c40f";

      if (data.status === "Approved") {
        statusColor = "#2ecc71";
      }

      if (data.status === "Rejected") {
        statusColor = "#e74c3c";
      }

      let investmentDate = "Not Available";

      if (data.createdAt) {
        investmentDate = data.createdAt.toDate().toLocaleString();
      }

      html += `
      <div class="card">

        <h2 style="color:gold;">Investment Details</h2>

        <p><b>Email:</b> ${user.email}</p>

        <p><b>Plan:</b> Rs.${data.plan}</p>

        <p><b>Investment Amount:</b> Rs.${data.amount}</p>

        <p><b>Payment Method:</b> ${data.paymentMethod}</p>

        <p><b>Investment Date:</b> ${investmentDate}</p>

        <p>
          <b>Status:</b>
          <span style="color:${statusColor};font-weight:bold;">
            ${data.status}
          </span>
        </p>

      </div>
      `;
    }

  });

  if (html === "") {
    html = "<h2>No investment request found.</h2>";
  }

  userData.innerHTML = html;

});
