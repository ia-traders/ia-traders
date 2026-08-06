import {
  db,
  auth,
  onAuthStateChanged,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from "../firebase.js";

console.log("Members JS Loaded");
console.log("Members JS Loaded");

window.addEventListener("DOMContentLoaded", () => {

  const membersTable = document.getElementById("membersTable");

  console.log("membersTable =", membersTable);

});

const membersTable = document.getElementById("membersTable");
console.log("membersTable =", membersTable);

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    location.href = "login.html";
    return;
  }

  loadMembers();

});

async function loadMembers() {

  membersTable.innerHTML = `
    <tr>
      <td colspan="6" style="padding:30px;text-align:center;">
        Loading Members...
      </td>
    </tr>
  `;

 const q = query(
  collection(db, "investmentRequests"),
  where("status", "==", "Approved")
);

const snapshot = await getDocs(q);
let html = "";
const shownUsers = new Set();
  
  snapshot.forEach((item) => {

    const data = item.data();
    if (shownUsers.has(data.uid)) return;

shownUsers.add(data.uid);

    html += `
      <tr>

        <td style="padding:15px;">${data.senderName || "-"}</td>

        <td>${data.email || "-"}</td>

        <td>${data.planName || "-"}</td>

        <td>Rs.${data.withdrawableBalance || 0}</td>

        <td>${data.status || "-"}</td>

        <td>
<button onclick="manageMember('${item.id}')">
  Manage
</button>
</td>

      </tr>
    `;

  });

  if (html === "") {
    html = `
      <tr>
        <td colspan="6" style="padding:30px;text-align:center;">
          No Members Found
        </td>
      </tr>
    `;
  }

  membersTable.innerHTML = html;

}
window.manageMember = async function(id){

  const ref = doc(db, "investmentRequests", id);

  const snap = await getDoc(ref);

  if(!snap.exists()){
    alert("Member not found");
    return;
  }

  const data = snap.data();

  document.getElementById("manageModal").style.display = "flex";

  document.getElementById("memberEmail").innerHTML =
    data.email;

  document.getElementById("newBalance").value =
    data.withdrawableBalance || 0;

  document.getElementById("newEarned").value =
    data.totalEarned || 0;

};
