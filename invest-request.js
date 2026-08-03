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

  const plan = Number(document.getElementById("plan").value);

  const senderName = document.getElementById("senderName").value.trim();
  const senderNumber = document.getElementById("senderNumber").value.trim();

  if (senderName === "" || senderNumber === "") {
    alert("Please fill all fields.");
    return;
  }

  // Plan Details
  let dailyProfit = 0;
  let planName = "";

  switch (plan) {

    case 1000:
      dailyProfit = 100;
      planName = "Starter";
      break;

    case 1500:
      dailyProfit = 170;
      planName = "Silver";
      break;

    case 2000:
      dailyProfit = 230;
      planName = "Gold";
      break;

    case 3000:
      dailyProfit = 350;
      planName = "Premium";
      break;

    case 5000:
      dailyProfit = 570;
      planName = "VIP";
      break;

    default:
      alert("Invalid Plan");
      return;
  }

  try {

    await addDoc(collection(db, "investmentRequests"), {

      uid: user.uid,
      email: user.email,

      plan: plan,
      planName: planName,

      amount: plan,
      dailyProfit: dailyProfit,

      totalEarned: 0,
      withdrawableBalance: 0,

      senderName: senderName,
      senderNumber: senderNumber,

      paymentMethod: "FirstPay",
      receiverName: "Muhammad Zubair",
      receiverNumber: "03290293365",

      status: "Pending",

      createdAt: serverTimestamp()

    });

    alert("Investment request submitted successfully.");

    window.location.href = "dashboard.html";

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

});
