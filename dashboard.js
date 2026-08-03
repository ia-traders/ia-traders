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

      html += `
        <div class="card">
          <p><b>Plan:</b> Rs.${data.plan}</p>
          <p><b>Amount:</b> Rs.${data.amount}</p>
          <p><b>Status:</b> ${data.status}</p>
          <p><b>Payment Method:</b> ${data.paymentMethod}</p>
        </div>
      `;
    }

  });

  if (html === "") {
    html = "<h2>No investment request found.</h2>";
  }

  userData.innerHTML = html;

});
