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

      // Status Color
      let statusColor = "#f1c40f";

      if (data.status === "Approved") {
        statusColor = "#2ecc71";
      }

      if (data.status === "Rejected") {
        statusColor = "#e74c3c";
      }

      // Investment Date
      let investmentDate = "Not Available";

      if (data.createdAt) {
        investmentDate = data.createdAt.toDate().toLocaleString();
      }

      // Daily Profit
      let dailyProfit = 0;

      switch (Number(data.plan)) {

        case 1000:
          dailyProfit = 100;
          break;

        case 1500:
          dailyProfit = 170;
          break;

        case 2000:
          dailyProfit = 230;
          break;

        case 3000:
          dailyProfit = 350;
          break;

        case 5000:
          dailyProfit = 570;
          break;

        default:
          dailyProfit = 0;
      }

      html += `

      <div class="card">

        <h2 style="color:gold;">Investment Details</h2>

        <p><b>Email:</b> ${user.email}</p>

        <p><b>Plan:</b> Rs.${data.plan}</p>

        <p><b>Investment Amount:</b> Rs.${data.amount}</p>

        <p><b>Daily Profit:</b> Rs.${dailyProfit}</p>

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
