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

if (data.status !== "Approved") return;
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
  
<div style="
background:#1b1b1b;
border:2px solid gold;
border-radius:18px;
padding:25px;
margin-bottom:25px;
box-shadow:0 0 15px rgba(255,215,0,.2);
">

<h2 style="color:gold;text-align:center;margin-bottom:20px;">
${planName}
</h2>

<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:15px;">

<div style="background:#111;padding:15px;border-radius:10px;">
<b>💰 Balance</b><br>
Rs.${withdrawableBalance}
</div>

<div style="background:#111;padding:15px;border-radius:10px;">
<b>📈 Total Earned</b><br>
Rs.${totalEarned}
</div>

<div style="background:#111;padding:15px;border-radius:10px;">
<b>💵 Daily Profit</b><br>
Rs.${dailyProfit}
</div>

<div style="background:#111;padding:15px;border-radius:10px;">
<b>🟢 Status</b><br>
<span style="color:${statusColor};font-weight:bold;">
${data.status}
</span>
</div>

<div style="background:#111;padding:15px;border-radius:10px;">
<b>📧 Email</b><br>
${user.email}
</div>

<div style="background:#111;padding:15px;border-radius:10px;">
<b>💳 Payment</b><br>
${data.paymentMethod}
</div>

</div>

<div style="margin-top:20px;background:#111;padding:15px;border-radius:10px;">
<b>📅 Investment Date</b><br>
${investmentDate}
</div>

<button
style="
width:100%;
margin-top:20px;
padding:15px;
background:gold;
border:none;
border-radius:10px;
font-weight:bold;
cursor:pointer;
font-size:16px;
">
Withdraw
</button>

</div>
`;
