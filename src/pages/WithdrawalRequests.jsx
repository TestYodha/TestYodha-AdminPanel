
// // ✅ FILE: pages/WithdrawalRequests.jsx

// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   doc,
//   getDoc,
//   updateDoc,
//   query,
//   orderBy,
// } from "firebase/firestore";
// import { db } from "../firebase";
// import "./WithdrawalRequests.css";

// const WithdrawalRequests = () => {
//   const [allRequests, setAllRequests] = useState({
//     pending: [],
//     accepted: [],
//     declined: [],
//     hold: [],
//   });

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     const q = query(
//       collection(db, "withdrawalRequests"),
//       orderBy("createdAt", "desc")
//     );
//     const snapshot = await getDocs(q);
//     const categorized = { pending: [], accepted: [], declined: [], hold: [] };

//     for (let docSnap of snapshot.docs) {
//       const req = docSnap.data();
//       const userSnap = await getDoc(doc(db, "users", req.userId));
//       const userData = userSnap.exists() ? userSnap.data() : {};
//       const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();

//       const data = {
//         id: docSnap.id,
//         name: fullName || "Unknown",
//         email: userData.email || "N/A",
//         amount: req.points || 0, // ✅ fixed here
//         upi: req.upi || "-",
//         status: req.status,
//         createdAt: req.createdAt?.toDate().toLocaleString() || "-",
//         declineReason: req.declineReason || null,
//       };

//       categorized[req.status]?.push(data);
//     }

//     setAllRequests(categorized);
//   };

//   const updateStatus = async (id, newStatus) => {
//     try {
//       if (newStatus === "declined") {
//         const reason = prompt("Enter reason for declining this request:");
//         if (!reason) return;
//         const fullReason = `${reason}\n\nNote: If the above reason is resolved, the status may be updated upon review.`;
//         await updateDoc(doc(db, "withdrawalRequests", id), {
//           status: "declined",
//           declineReason: fullReason,
//         });
//       } else if (newStatus === "revoked") {
//         await updateDoc(doc(db, "withdrawalRequests", id), {
//           status: "pending",
//           declineReason: null,
//         });
//       } else {
//         await updateDoc(doc(db, "withdrawalRequests", id), { status: newStatus });
//       }
//       fetchRequests();
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };

//   const renderTable = (title, data, actions, showReason = false) => {
//     return (
//       <div className="responsive-table">
//         <h3>{title}</h3>
//         {data.length === 0 ? (
//           <p style={{ textAlign: "center", color: "white" }}>No records available.</p>
//         ) : (
//           <div style={{ overflowX: "auto" }}>
//             <table className="withdrawal-table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Amount</th>
//                   <th>UPI</th>
//                   <th>Date</th>
//                   <th>Status</th>
//                   {showReason && <th>Reason</th>}
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((req, i) => (
//                   <tr key={i}>
//                     <td>{req.name}</td>
//                     <td>{req.email}</td>
//                     <td>₹{req.amount}</td>
//                     <td>{req.upi}</td>
//                     <td>{req.createdAt}</td>
//                     <td>{req.status}</td>
//                     {showReason && (
//                       <td>
//                         {req.declineReason ? (
//                           <div>
//                             <div style={{ fontWeight: "bold" }}>
//                               {req.declineReason.split("\n\n")[0]}
//                             </div>
//                             <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>
//                               {req.declineReason.split("\n\n")[1]}
//                             </div>
//                           </div>
//                         ) : (
//                           "-"
//                         )}
//                       </td>
//                     )}
//                     <td>
//                       {actions.map((action, j) => (
//                         <button
//                           key={j}
//                           className={`btn ${action.className}`}
//                           onClick={() => updateStatus(req.id, action.to)}
//                         >
//                           {action.label}
//                         </button>
//                       ))}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="withdrawal-container" style={{ marginTop: "350px" }}>
//       <h2>Withdrawal Requests</h2>

//       {renderTable("Pending Requests", allRequests.pending, [
//         { label: "Accept", to: "accepted", className: "green" },
//         { label: "Decline", to: "declined", className: "red" },
//         { label: "Hold", to: "hold", className: "yellow" },
//       ])}

//       {renderTable("On Hold", allRequests.hold, [
//         { label: "Accept", to: "accepted", className: "green" },
//         { label: "Revoke", to: "revoked", className: "red" },
//       ])}

//       {renderTable("Accepted", allRequests.accepted, [
//         { label: "Revoke", to: "revoked", className: "red" },
//         { label: "Put on Hold", to: "hold", className: "yellow" },
//       ])}

//       {renderTable("Declined", allRequests.declined, [
//         { label: "Move to Hold", to: "hold", className: "yellow" },
//       ], true)}
//     </div>
//   );
// };

// export default WithdrawalRequests;



import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import html2pdf from "html2pdf.js";
import { Download } from "lucide-react";
import "./WithdrawalRequests.css";

const WithdrawalRequests = () => {
  const [allRequests, setAllRequests] = useState({
    pending: [],
    accepted: [],
    declined: [],
    hold: [],
  });

  const tableRefs = useRef({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const q = query(collection(db, "withdrawalRequests"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const categorized = { pending: [], accepted: [], declined: [], hold: [] };

    for (let docSnap of snapshot.docs) {
      const req = docSnap.data();
      const userSnap = await getDoc(doc(db, "users", req.userId));
      const userData = userSnap.exists() ? userSnap.data() : {};
      const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();

      const data = {
        id: docSnap.id,
        name: fullName || "Unknown",
        email: userData.email || "N/A",
        amount: req.points || 0,
        upi: req.upi || "-",
        status: req.status,
        createdAt: req.createdAt?.toDate().toLocaleString() || "-",
        declineReason: req.declineReason || null,
      };

      categorized[req.status]?.push(data);
    }

    setAllRequests(categorized);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      if (newStatus === "declined") {
        const reason = prompt("Enter reason for declining this request:");
        if (!reason) return;
        const fullReason = `${reason}\n\nNote: If the above reason is resolved, the status may be updated upon review.`;
        await updateDoc(doc(db, "withdrawalRequests", id), {
          status: "declined",
          declineReason: fullReason,
        });
      } else if (newStatus === "revoked") {
        await updateDoc(doc(db, "withdrawalRequests", id), {
          status: "pending",
          declineReason: null,
        });
      } else {
        await updateDoc(doc(db, "withdrawalRequests", id), { status: newStatus });
      }
      fetchRequests();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDownload = (type) => {
    const element = tableRefs.current[type];
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `${type}_Withdrawal_Requests.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const renderTable = (title, data, actions, type, showReason = false) => (
    <div className="responsive-table">
      <div className="test-header">
        <h3>{title}</h3>
        {data.length > 0 && (
          <button className="download-btn" onClick={() => handleDownload(type)}>
            <Download size={16} style={{ marginRight: 6 }} />
            Download PDF
          </button>
        )}
      </div>

      <div ref={(el) => (tableRefs.current[type] = el)} className="pdf-export-container">
        <h2 className="pdf-title">{title}</h2>
        {data.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>No records available.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="withdrawal-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>UPI</th>
                  <th>Date</th>
                  <th>Status</th>
                  {showReason && <th>Reason</th>}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((req, i) => (
                  <tr key={i}>
                    <td>{req.name}</td>
                    <td>{req.email}</td>
                    <td>₹{req.amount}</td>
                    <td>{req.upi}</td>
                    <td>{req.createdAt}</td>
                    <td>{req.status}</td>
                    {showReason && (
                      <td>
                        {req.declineReason ? (
                          <div>
                            <div style={{ fontWeight: "bold" }}>
                              {req.declineReason.split("\n\n")[0]}
                            </div>
                            <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>
                              {req.declineReason.split("\n\n")[1]}
                            </div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                    )}
                    <td>
                      {actions.map((action, j) => (
                        <button
                          key={j}
                          className={`btn ${action.className}`}
                          onClick={() => updateStatus(req.id, action.to)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="page-content-container">
      <h2 className="page-heading">Withdrawal Requests</h2>

      {renderTable("Pending Requests", allRequests.pending, [
        { label: "Accept", to: "accepted", className: "green" },
        { label: "Decline", to: "declined", className: "red" },
        { label: "Hold", to: "hold", className: "yellow" },
      ], "pending")}

      {renderTable("On Hold", allRequests.hold, [
        { label: "Accept", to: "accepted", className: "green" },
        { label: "Revoke", to: "revoked", className: "red" },
      ], "hold")}

      {renderTable("Accepted", allRequests.accepted, [
        { label: "Revoke", to: "revoked", className: "red" },
        { label: "Put on Hold", to: "hold", className: "yellow" },
      ], "accepted")}

      {renderTable("Declined", allRequests.declined, [
        { label: "Move to Hold", to: "hold", className: "yellow" },
      ], "declined", true)}
    </div>
  );
};

export default WithdrawalRequests;
