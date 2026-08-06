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

let currentMemberId = "";

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

        <td style="padding:15px;">
          ${data.senderName || "-"}
        </td>

        <td>
          ${data.email || "-"}
        </td>

        <td>
          ${data.planName || "-"}
        </td>

        <td>
          Rs.${data.withdrawableBalance || 0}
        </td>

        <td>
          ${data.status || "-"}
        </td>

        <td>
          <button class="manage-btn"
                  data-id="${item.id}">
            Manage
          </button>
        </td>

      </tr>
    `;

  });

  if (html === "") {

    html = `
      <tr>
        <td colspan="6"
            style="padding:30px;text-align:center;">
          No Members Found
        </td>
      </tr>
    `;

  }

  membersTable.innerHTML = html;

  document.querySelectorAll(".manage-btn").forEach((btn) => {

    btn.addEventListener("click", async () => {

      const id = btn.dataset.id;

      currentMemberId = id;

      const ref = doc(db, "investmentRequests", id);

      const snap = await getDoc(ref);

      if (!snap.exists()) {

        alert("Member not found");

        return;

      }

      const data = snap.data();

      document.getElementById("manageModal").style.display = "flex";

      document.getElementById("memberEmail").textContent =
        data.email || "-";

      document.getElementById("newBalance").value =
        data.withdrawableBalance || 0;

      document.getElementById("newEarned").value =
        data.totalEarned || 0;

    });

  });

}document.getElementById("closeModal").addEventListener("click", () => {

  document.getElementById("manageModal").style.display = "none";

});

document.getElementById("saveMember").addEventListener("click", async () => {

  if (!currentMemberId) {
    alert("No member selected.");
    return;
  }

  try {

    await updateDoc(
      doc(db, "investmentRequests", currentMemberId),
      {
        withdrawableBalance: Number(
          document.getElementById("newBalance").value
        ),

        totalEarned: Number(
          document.getElementById("newEarned").value
        )
      }
    );

    alert("Member updated successfully.");

    document.getElementById("manageModal").style.display = "none";

    currentMemberId = "";

    loadMembers();

  } catch (error) {

    console.error(error);

    alert("Error updating member.");

  }

});
