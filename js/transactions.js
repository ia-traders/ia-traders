import {
  db,
  auth,
  onAuthStateChanged,
  collection,
  getDocs
} from "../firebase.js";

console.log("Transactions JS Loaded");

const transactionsTable = document.getElementById("transactionsTable");
const searchTransaction = document.getElementById("searchTransaction");

let allTransactions = [];


onAuthStateChanged(auth, (user)=>{

  if(!user){
    location.href="login.html";
    return;
  }

  loadTransactions();

});


async function loadTransactions(){

  transactionsTable.innerHTML = `
  <tr>
    <td colspan="5">
      Loading Transactions...
    </td>
  </tr>
  `;


  try{

    allTransactions = [];


    // Deposits

    const depositSnap = await getDocs(
      collection(db,"investmentRequests")
    );


    depositSnap.forEach((item)=>{

      const data = item.data();


      allTransactions.push({

        type:"Deposit",

        email:data.email || "-",

        amount:
        `${data.planName || "Plan"} - Rs.${data.amount || 0}`,

        status:data.status || "Pending",

        date:
        data.createdAt
        ?
        data.createdAt.toDate().toLocaleDateString()
        :
        "-"

      });


    });



    // Withdraws

    const withdrawSnap = await getDocs(
      collection(db,"withdrawRequests")
    );


    withdrawSnap.forEach((item)=>{

      const data=item.data();


      allTransactions.push({

        type:"Withdraw",

        email:data.email || "-",

        amount:
        `Rs.${data.amount || 0}`,

        status:data.status || "Pending",

        date:
        data.createdAt
        ?
        data.createdAt.toDate().toLocaleDateString()
        :
        "-"

      });


    });



    renderTransactions(allTransactions);



  }catch(error){

    console.error(error);

    transactionsTable.innerHTML=`

    <tr>

    <td colspan="5" style="color:red;">

    Error Loading Transactions

    </td>

    </tr>

    `;

  }


}



function renderTransactions(list){


  if(list.length===0){

    transactionsTable.innerHTML=`

    <tr>

    <td colspan="5">

    No Transactions Found

    </td>

    </tr>

    `;

    return;

  }



  let html="";



  list.forEach((item)=>{


    let statusClass="";


    if(item.status==="Approved"){

      statusClass="status-approved";

    }

    else if(item.status==="Rejected"){

      statusClass="status-rejected";

    }

    else{

      statusClass="status-pending";

    }



    html +=`

    <tr>

    <td>
    ${item.type}
    </td>


    <td>
    ${item.email}
    </td>


    <td>
    ${item.amount}
    </td>


    <td class="${statusClass}">
    ${item.status}
    </td>


    <td>
    ${item.date}
    </td>


    </tr>

    `;


  });



  transactionsTable.innerHTML=html;


}




searchTransaction.addEventListener("input",()=>{


  const value =
  searchTransaction.value
  .toLowerCase()
  .trim();



  const filtered =
  allTransactions.filter((item)=>{


    return item.email
    .toLowerCase()
    .includes(value);


  });



  renderTransactions(filtered);


});
