```javascript
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

const ADMIN_EMAIL = "irfanali555567@gmail.com";

const membersTable = document.getElementById("membersTable");
const manageModal = document.getElementById("manageModal");
const memberEmail = document.getElementById("memberEmail");
const newBalance = document.getElementById("newBalance");
const newEarned = document.getElementById("newEarned");
const saveMember = document.getElementById("saveMember");
const closeModal = document.getElementById("closeModal");
const searchMember = document.getElementById("searchMember");

let currentMemberId = "";
let currentMemberSource = "";
let allMembers = [];

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  if (user.email !== ADMIN_EMAIL) {
    document.body.innerHTML = `
      <h1 style="color:red;text-align:center;margin-top:50px;">
        Access Denied
      </h1>
    `;
    return;
  }

  await loadMembers();
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
    // All registered users
    const usersSnapshot = await getDocs(
      collection(db, "users")
    );

    // Approved investments
    const investmentQuery = query(
      collection(db, "investmentRequests"),
      where("status", "==", "Approved")
    );

    const investmentSnapshot = await getDocs(
      investmentQuery
    );

    const investmentsByUid = new Map();

    investmentSnapshot.forEach((item) => {
      const data = item.data();

      if (data.uid) {
        investmentsByUid.set(data.uid, {
          id: item.id,
          ...data
        });
      }
    });

    allMembers = [];

    usersSnapshot.forEach((item) => {
      const userData = item.data();
      const uid = item.id;

      const investment = investmentsByUid.get(uid);

      allMembers.push({
        userId: uid,

        investmentId: investment
          ? investment.id
          : "",

        source: investment
          ? "investmentRequests"
          : "users",

        senderName:
          userData.name ||
          userData.senderName ||
          "-",

        email:
          userData.email ||
          "-",

        planName:
          investment?.planName ||
          (investment?.plan
            ? "Plan Rs." + investment.plan
            : "No Investment"),

        withdrawableBalance:
          investment?.withdrawableBalance ??
          userData.withdrawableBalance ??
          0,

        totalEarned:
          investment?.totalEarned ??
          userData.totalEarned ??
          0,

        status:
          investment?.status ||
          "No Investment"
      });
    });

    renderMembers(allMembers);

  } catch (error) {
    console.error("Members Loading Error:", error);

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
    let statusStyle = "";

    if (member.status === "Approved") {
      statusStyle = 'style="color:#2ecc71;font-weight:bold;"';
    } else if (member.status === "No Investment") {
      statusStyle = 'style="color:#f1c40f;font-weight:bold;"';
    }

    html += `
      <tr>

        <td style="padding:15px;">
          ${escapeHTML(member.senderName)}
        </td>

        <td>
          ${escapeHTML(member.email)}
        </td>

        <td>
          ${escapeHTML(member.planName)}
        </td>

        <td>
          Rs.${Number(member.withdrawableBalance || 0)}
        </td>

        <td ${statusStyle}>
          ${escapeHTML(member.status)}
        </td>

        <td>
          <button
            class="manage-btn"
            data-user-id="${member.userId}"
            data-investment-id="${member.investmentId}"
            data-source="${member.source}">
            Manage
          </button>
        </td>

      </tr>
    `;
  });

  membersTable.innerHTML = html;

  document.querySelectorAll(".manage-btn").forEach((button) => {
    button.addEventListener("click", () => {
      openManageMember(button);
    });
  });
}

async function openManageMember(button) {
  try {
    const userId = button.dataset.userId;
    const investmentId = button.dataset.investmentId;
    const source = button.dataset.source;

    let data = {};

    if (source === "investmentRequests" && investmentId) {
      currentMemberId = investmentId;
      currentMemberSource = "investmentRequests";

      const ref = doc(
        db,
        "investmentRequests",
        investmentId
      );

      const snapshot = await getDoc(ref);

      if (!snapshot.exists()) {
        alert("Investment record not found.");
        return;
      }

      data = snapshot.data();

    } else {
      currentMemberId = userId;
      currentMemberSource = "users";

      const ref = doc(
        db,
        "users",
        userId
      );

      const snapshot = await getDoc(ref);

      if (!snapshot.exists()) {
        alert("User record not found.");
        return;
      }

      data = snapshot.data();
    }

    memberEmail.textContent =
      data.email || "-";

    newBalance.value =
      data.withdrawableBalance ?? 0;

    newEarned.value =
      data.totalEarned ?? 0;

    manageModal.style.display = "flex";

  } catch (error) {
    console.error("Manage Error:", error);
    alert("Failed to load member.");
  }
}

saveMember.addEventListener("click", async () => {
  if (!currentMemberId) {
    alert("No member selected.");
    return;
  }

  try {
    const balance =
      Number(newBalance.value) || 0;

    const earned =
      Number(newEarned.value) || 0;

    if (currentMemberSource === "investmentRequests") {
      await updateDoc(
        doc(
          db,
          "investmentRequests",
          currentMemberId
        ),
        {
          withdrawableBalance: balance,
          totalEarned: earned
        }
      );
    } else {
      await updateDoc(
        doc(
          db,
          "users",
          currentMemberId
        ),
        {
          withdrawableBalance: balance,
          totalEarned: earned
        }
      );
    }

    alert("Member updated successfully.");

    manageModal.style.display = "none";

    currentMemberId = "";
    currentMemberSource = "";

    await loadMembers();

  } catch (error) {
    console.error("Update Error:", error);
    alert("Error updating member.");
  }
});

closeModal.addEventListener("click", () => {
  manageModal.style.display = "none";
  currentMemberId = "";
  currentMemberSource = "";
});

window.addEventListener("click", (event) => {
  if (event.target === manageModal) {
    manageModal.style.display = "none";
    currentMemberId = "";
    currentMemberSource = "";
  }
});

searchMember.addEventListener("input", () => {
  const value =
    searchMember.value
      .toLowerCase()
      .trim();

  const filtered = allMembers.filter((member) => {
    const name =
      String(member.senderName || "")
        .toLowerCase();

    const email =
      String(member.email || "")
        .toLowerCase();

    return (
      name.includes(value) ||
      email.includes(value)
    );
  });

  renderMembers(filtered);
});

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```
