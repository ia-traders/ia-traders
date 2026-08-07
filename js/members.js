import {
  db,
  auth,
  onAuthStateChanged,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc
} from "../firebase.js";

console.log("Members JS Loaded");

const membersTable = document.getElementById("membersTable");
const manageModal = document.getElementById("manageModal");
const memberEmail = document.getElementById("memberEmail");
const newBalance = document.getElementById("newBalance");
const newEarned = document.getElementById("newEarned");
const saveMember = document.getElementById("saveMember");
const closeModal = document.getElementById("closeModal");
const searchMember = document.getElementById("searchMember");

let currentMemberId = "";
let allMembers = [];

onAuthStateChanged(auth, (user) => {
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

  try {
    const q = query(
      collection(db, "investmentRequests"),
      where("status", "==", "Approved")
    );

    const snapshot = await getDocs(q);

    const shownUsers = new Set();
    allMembers = [];

    snapshot.forEach((item) => {
      const data = item.data();

      if (!data.uid) return;

      if (shownUsers.has(data.uid)) return;

      shownUsers.add(data.uid);

      allMembers.push({
        id: item.id,
        ...data
      });
    });

    renderMembers(allMembers);

  } catch (err) {
    console.error(err);

    membersTable.innerHTML = `
      <tr>
        <td colspan="6" style="padding:30px;text-align:center;color:red;">
          Error Loading Members
        </td>
      </tr>
    `;
  }
}

function renderMembers(list) {

  if (list.length === 0) {
    membersTable.innerHTML = `
      <tr>
        <td colspan="6" style="padding:30px;text-align:center;">
          No Members Found
        </td>
      </tr>
    `;
    return;
  }

  let html = "";

  list.forEach((member) => {

    html += `
      <tr>

        <td>${member.senderName || "-"}</td>

        <td>${member.email || "-"}</td>

        <td>${member.planName || "-"}</td>

        <td>Rs.${member.withdrawableBalance || 0}</td>

        <td>${member.status || "-"}</td>

        <td>
          <button
            class="manage-btn"
            data-id="${member.id}">
            Manage
          </button>
        </td>

      </tr>
    `;

  });

  membersTable.innerHTML = html;

  document.querySelectorAll(".manage-btn").forEach((btn) => {

    btn.addEventListener("click", async () => {

      try {

        currentMemberId = btn.dataset.id;

        const ref = doc(db, "investmentRequests", currentMemberId);

        const snap = await getDoc(ref);

        if (!snap.exists()) {
          alert("Member not found.");
          return;
        }

        const data = snap.data();

        memberEmail.textContent = data.email || "-";
        newBalance.value = data.withdrawableBalance || 0;
        newEarned.value = data.totalEarned || 0;

        manageModal.style.display = "flex";

      } catch (err) {
        console.error(err);
        alert("Failed to load member.");
      }

    });

  });

}

saveMember.addEventListener("click", async () => {

  if (!currentMemberId) {
    alert("No member selected.");
    return;
  }

  try {

    await updateDoc(
      doc(db, "investmentRequests", currentMemberId),
      {
        withdrawableBalance: Number(newBalance.value),
        totalEarned: Number(newEarned.value)
      }
    );

    alert("Member updated successfully.");

    manageModal.style.display = "none";

    currentMemberId = "";

    loadMembers();

  } catch (err) {

    console.error(err);

    alert("Error updating member.");

  }

});

closeModal.addEventListener("click", () => {

  manageModal.style.display = "none";

  currentMemberId = "";

});

window.addEventListener("click", (e) => {

  if (e.target === manageModal) {
    manageModal.style.display = "none";
    currentMemberId = "";
  }

});

searchMember.addEventListener("input", () => {

  const value = searchMember.value.toLowerCase().trim();

  const filtered = allMembers.filter((member) => {

    const name = (member.senderName || "").toLowerCase();
    const email = (member.email || "").toLowerCase();

    return (
      name.includes(value) ||
      email.includes(value)
    );

  });

  renderMembers(filtered);

});
