import {
  db,
  auth,
  onAuthStateChanged,
  collection,
  getDocs,
  query,
  where
} from "../firebase.js";

const ADMIN_EMAIL = "irfanali555567@gmail.com";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    location.href = "login.html";
    return;
  }

  if (user.email !== ADMIN_EMAIL) {
    document.body.innerHTML =
      "<h1 style='color:red;text-align:center;margin-top:50px;'>Access Denied</h1>";
    return;
  }

  loadDashboard();

});

async function loadDashboard() {

  // Cards
  const totalMembers = document.getElementById("totalMembers");
  const pendingDeposits = document.getElementById("pendingDeposits");
  const pendingWithdraws = document.getElementById("pendingWithdraws");
  const activePlans = document.getElementById("activePlans");
  const recentActivity = document.getElementById("recentActivity");

  // ----------------------------
  // Investment Requests
  // ----------------------------

  const investmentSnap = await getDocs(
    collection(db, "investmentRequests")
  );

  let members = 0;
  let pendingDeposit = 0;
  let active = 0;

  let activityHTML = "";

  investmentSnap.forEach(doc => {

    const data = doc.data();

    if (data.status === "Approved") {
      members++;
      active++;
    }

    if (data.status === "Pending") {
      pendingDeposit++;
    }

    activityHTML += `
      <div style="
        background:#111;
        padding:15px;
        border-radius:10px;
        margin-bottom:10px;
      ">
        <b>${data.email}</b><br>
        ${data.planName} - ${data.status}
      </div>
    `;

  });

  // ----------------------------
  // Withdraw Requests
  // ----------------------------

  const withdrawSnap = await getDocs(
    collection(db, "withdrawRequests")
  );

  let pendingWithdraw = 0;

  withdrawSnap.forEach(doc => {

    const data = doc.data();

    if (data.status === "Pending") {
      pendingWithdraw++;
    }

  });

  // ----------------------------
  // Set Dashboard Values
  // ----------------------------

  totalMembers.textContent = members;

  pendingDeposits.textContent = pendingDeposit;

  pendingWithdraws.textContent = pendingWithdraw;

  activePlans.textContent = active;

  if (activityHTML === "") {
    activityHTML =
      "<p style='color:#999;'>No recent activity.</p>";
  }

  recentActivity.innerHTML = activityHTML;

}
