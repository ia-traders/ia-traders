import {
  db,
  auth,
  addDoc,
  collection,
  serverTimestamp
} from "../firebase.js";

const btn = document.getElementById("withdrawBtn");

btn.addEventListener("click", async () => {

  const user = auth.currentUser;

  if (!user) {
    alert("Please login first.");
    return;
  }

  const amount = document.getElementById("amount").value.trim();
  const paymentMethod = document.getElementById("paymentMethod").value;
  const account = document.getElementById("account").value.trim();

  if (amount === "" || account === "") {
    alert("Please fill all fields.");
    return;
  }

  try {

    await addDoc(collection(db, "withdrawRequests"), {

      uid: user.uid,
      email: user.email,

      amount: amount,
      paymentMethod: paymentMethod,
      account: account,

      status: "Pending",

      createdAt: serverTimestamp()

    });

    alert("Withdraw request submitted successfully.");

    window.location.href = "withdraw-history.html";

  } catch (error) {

    alert(error.message);
    console.error(error);

  }

});
