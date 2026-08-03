import {
  db,
  auth,
  addDoc,
  collection,
  serverTimestamp
} from "./firebase.js";

console.log("Investment JS Loaded");

const submitBtn = document.getElementById("submitRequest");

submitBtn.addEventListener("click", async () => {

  const user = auth.currentUser;

  if (!user) {
    alert("Please login first.");
    return;
  }

  const plan = document.getElementById("plan").value;
  const senderName = document.getElementById("senderName").value.trim();
  const senderNumber = document.getElementById("senderNumber").value.trim();

  if (senderName === "" || senderNumber === "") {
    alert("Please fill all fields.");
    return;
  }

  try {

    await addDoc(collection(db, "investmentRequests"), {
      email: user.email,
      uid: user.uid,
      plan: plan,
      amount: plan,
      senderName: senderName,
      senderNumber: senderNumber,
      paymentMethod: "FirstPay",
      receiverName: "Muhammad Zubair",
      receiverNumber: "03290293365",
      status: "Pending",
      createdAt: serverTimestamp()
    });

    alert("Investment request submitted successfully.");

    // Dashboard par bhej do
    window.location.href = "dashboard.html";

  } catch (error) {

    console.error(error);
    alert("Error: " + error.message);

  }

});
