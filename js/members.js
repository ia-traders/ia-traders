
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


/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (user.email !== ADMIN_EMAIL) {

    document.body.innerHTML =
      "<h1 style='color:red;text-align:center;margin-top:50px;'>Access Denied</h1>";

    return;
  }

  await loadMembers();

});


/* =========================
   LOAD MEMBERS
========================= */

async function loadMembers() {

  membersTable.innerHTML =
    "<tr>" +
    "<td colspan='6' style='padding:30px;text-align:center;'>" +
    "Loading Members..." +
    "</td>" +
    "</tr>";

  try {

    /*
      Get ALL registered users
    */

    const usersSnapshot = await getDocs(
      collection(db, "users")
    );


    /*
      Get approved investments
    */

    const investmentQuery = query(
      collection(db, "investmentRequests"),
      where("status", "==", "Approved")
    );

    const investmentSnapshot = await getDocs(
      investmentQuery
    );


    /*
      Store investments by UID
    */

    const investmentMap = new Map();

    investmentSnapshot.forEach((item) => {

      const data = item.data();

      if (data.uid) {

        investmentMap.set(
          data.uid,
          {
            id: item.id,
            data: data
          }
        );

      }

    });


    /*
      Create members list
    */

    allMembers = [];


    usersSnapshot.forEach((item) => {

      const userData = item.data();

      const uid = item.id;

      const investment =
        investmentMap.get(uid);


      let member = {

        userId: uid,

        investmentId: "",

        source: "users",

        name:
          userData.name ||
          userData.senderName ||
          "-",

        email:
          userData.email ||
          "-",

        plan:
          "No Investment",

        balance:
          userData.withdrawableBalance || 0,

        earned:
          userData.totalEarned || 0,

        status:
          "No Investment"

      };


      /*
        If user has approved investment
      */

      if (investment) {

        const data = investment.data;

        member.investmentId =
          investment.id;

        member.source =
          "investmentRequests";

        member.plan =
          data.planName ||
          (
            data.plan
              ? "Rs." + data.plan
              : "Investment Plan"
          );

        member.balance =
          data.withdrawableBalance || 0;

        member.earned =
          data.totalEarned || 0;

        member.status =
          data.status || "Approved";

      }


      allMembers.push(member);

    });


    renderMembers(allMembers);


  } catch (error) {

    console.error(
      "Members Loading Error:",
      error
    );

    membersTable.innerHTML =
      "<tr>" +
      "<td colspan='6' style='padding:30px;text-align:center;color:red;'>" +
      "Error Loading Members" +
      "</td>" +
      "</tr>";

  }

}


/* =========================
   SHOW MEMBERS
========================= */

function renderMembers(list) {

  if (list.length === 0) {

    membersTable.innerHTML =
      "<tr>" +
      "<td colspan='6' style='padding:30px;text-align:center;'>" +
      "No Members Found" +
      "</td>" +
      "</tr>";

    return;
  }


  let html = "";


  list.forEach((member) => {

    html +=
      "<tr>" +

      "<td style='padding:15px;'>" +
      escapeHTML(member.name) +
      "</td>" +

      "<td>" +
      escapeHTML(member.email) +
      "</td>" +

      "<td>" +
      escapeHTML(member.plan) +
      "</td>" +

      "<td>" +
      "Rs." +
      Number(member.balance || 0) +
      "</td>" +

      "<td>" +
      escapeHTML(member.status) +
      "</td>" +

      "<td>" +

      "<button " +
      "class='manage-btn' " +
      "data-user-id='" +
      member.userId +
      "' " +
      "data-investment-id='" +
      member.investmentId +
      "' " +
      "data-source='" +
      member.source +
      "'>" +

      "Manage" +

      "</button>" +

      "</td>" +

      "</tr>";

  });


  membersTable.innerHTML = html;


  /*
    Manage buttons
  */

  const buttons =
    document.querySelectorAll(
      ".manage-btn"
    );


  buttons.forEach((button) => {

    button.addEventListener(
      "click",
      function () {

        openMember(this);

      }
    );

  });

}


/* =========================
   OPEN MEMBER
========================= */

async function openMember(button) {

  try {

    const userId =
      button.getAttribute(
        "data-user-id"
      );

    const investmentId =
      button.getAttribute(
        "data-investment-id"
      );

    const source =
      button.getAttribute(
        "data-source"
      );


    let data = {};


    /*
      Investment member
    */

    if (
      source === "investmentRequests" &&
      investmentId
    ) {

      currentMemberId =
        investmentId;

      currentMemberSource =
        "investmentRequests";


      const snapshot =
        await getDoc(
          doc(
            db,
            "investmentRequests",
            investmentId
          )
        );


      if (!snapshot.exists()) {

        alert(
          "Investment record not found."
        );

        return;
      }


      data =
        snapshot.data();

    }


    /*
      Normal signup member
    */

    else {

      currentMemberId =
        userId;

      currentMemberSource =
        "users";


      const snapshot =
        await getDoc(
          doc(
            db,
            "users",
            userId
          )
        );


      if (!snapshot.exists()) {

        alert(
          "User record not found."
        );

        return;
      }


      data =
        snapshot.data();

    }


    /*
      Fill popup
    */

    memberEmail.textContent =
      data.email || "-";


    newBalance.value =
      data.withdrawableBalance || 0;


    newEarned.value =
      data.totalEarned || 0;


    manageModal.style.display =
      "flex";


  } catch (error) {

    console.error(
      "Manage Member Error:",
      error
    );

    alert(
      "Failed to load member."
    );

  }

}


/* =========================
   SAVE MEMBER
========================= */

saveMember.addEventListener(
  "click",
  async function () {

    if (!currentMemberId) {

      alert(
        "No member selected."
      );

      return;
    }


    try {

      const balance =
        Number(
          newBalance.value
        ) || 0;


      const earned =
        Number(
          newEarned.value
        ) || 0;


      /*
        Save investment member
      */

      if (
        currentMemberSource ===
        "investmentRequests"
      ) {

        await updateDoc(

          doc(
            db,
            "investmentRequests",
            currentMemberId
          ),

          {
            withdrawableBalance:
              balance,

            totalEarned:
              earned
          }

        );

      }


      /*
        Save normal user
      */

      else {

        await updateDoc(

          doc(
            db,
            "users",
            currentMemberId
          ),

          {
            withdrawableBalance:
              balance,

            totalEarned:
              earned
          }

        );

      }


      alert(
        "Member updated successfully."
      );


      manageModal.style.display =
        "none";


      currentMemberId = "";

      currentMemberSource = "";


      await loadMembers();


    } catch (error) {

      console.error(
        "Update Member Error:",
        error
      );

      alert(
        "Error updating member."
      );

    }

  }
);


/* =========================
   CLOSE MODAL
========================= */

closeModal.addEventListener(
  "click",
  function () {

    manageModal.style.display =
      "none";

    currentMemberId = "";

    currentMemberSource = "";

  }
);


/* =========================
   CLOSE MODAL OUTSIDE
========================= */

window.addEventListener(
  "click",
  function (event) {

    if (
      event.target ===
      manageModal
    ) {

      manageModal.style.display =
        "none";

      currentMemberId = "";

      currentMemberSource = "";

    }

  }
);


/* =========================
   SEARCH
========================= */

searchMember.addEventListener(
  "input",
  function () {

    const value =
      searchMember.value
        .toLowerCase()
        .trim();


    const filtered =
      allMembers.filter(
        function (member) {

          const name =
            String(
              member.name || ""
            ).toLowerCase();


          const email =
            String(
              member.email || ""
            ).toLowerCase();


          return (
            name.includes(value) ||
            email.includes(value)
          );

        }
      );


    renderMembers(
      filtered
    );

  }
);


/* =========================
   HTML SAFETY
========================= */

function escapeHTML(value) {

  return String(
    value || ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}
```
