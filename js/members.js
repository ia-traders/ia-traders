import {
  db,
  auth,
  onAuthStateChanged,
  collection,
  getDocs,
  query,
  where
} from "../firebase.js";

console.log("Members JS Loaded");

const membersTable = document.getElementById("membersTable");

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
window.manageMember = function(id){

  alert("Member ID: " + id);

};
