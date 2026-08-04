import {
  db,
  auth,
  onAuthStateChanged,
  collection,
  getDocs
} from "../firebase.js";

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

    if (data.uid !== user.uid) return;

    let statusColor = "#f1c40f";

    if (data.status === "Approved") {
      statusColor = "#2ecc71";
    } else if (data.status === "Rejected") {
      statusColor = "#e74c3c";
    }

    let investmentDate = "Not Available";

    if (data.createdAt) {
      investmentDate = data.createdAt.toDate().toLocaleString();
    }

    let dailyProfit = data.dailyProfit ?? 0;

    if (dailyProfit === 0) {
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
      }
    }

    const planName = data.planName || "Investment Plan";
    const totalEarned = data.totalEarned ?? 0;
    const withdrawableBalance = data.withdrawableBalance ?? 0;

    html += `
      <div class="card">

        <h2 style="color:gold;">${planName}</h2>

        <p><b>Email:</b> ${user.email}</p>

        <p><b>Investment:</b> Rs.${data.amount}</p>

        <p><b>Daily Profit:</b> Rs.${dailyProfit}</p>

        <p><b>Total Earned:</b> Rs.${totalEarned}</p>

        <p><b>Withdrawable Balance:</b> Rs.${withdrawableBalance}</p>

        <p><b>Payment Method:</b> ${data.paymentMethod}</p>

        <p><b>Investment Date:</b> ${investmentDate}</p>

        <p>
          <b>Status:</b>
          <span style="color:${statusColor};font-weight:bold;">
            ${data.status}
          </span>
        </p>

        <button
          style="
            width:100%;
            margin-top:15px;
            padding:12px;
            background:gold;
            border:none;
            border-radius:8px;
            font-weight:bold;
            cursor:pointer;
          ">
          Withdraw
        </button>

      </div>
    `;

  });

  if (html === "") {
    html = "<h2>No investment request found.</h2>";
  }

  userData.innerHTML = html;

});
