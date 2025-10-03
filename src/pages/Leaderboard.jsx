
// // // // // // ✅ FILE: pages/Leaderboard.jsx

// // // // // import React, { useEffect, useState } from "react";
// // // // // import {
// // // // //   collection,
// // // // //   getDocs,
// // // // //   doc,
// // // // //   getDoc,
// // // // // } from "firebase/firestore";
// // // // // import { db } from "../firebase";
// // // // // import { BarChart3 } from "lucide-react";
// // // // // import "./Leaderboard.css";

// // // // // const Leaderboard = () => {
// // // // //   const [leaderboardData, setLeaderboardData] = useState([]);

// // // // //   useEffect(() => {
// // // // //     fetchAllLeaderboards();
// // // // //   }, []);

// // // // //   const fetchAllLeaderboards = async () => {
// // // // //     const testsSnapshot = await getDocs(collection(db, "tests"));
// // // // //     const finalData = [];

// // // // //     for (let testDoc of testsSnapshot.docs) {
// // // // //       const testId = testDoc.id;
// // // // //       const testName = testDoc.data()?.name || "Unnamed Test";
// // // // //       const userAttemptsRef = collection(
// // // // //         db,
// // // // //         "tests",
// // // // //         testId,
// // // // //         "userAttempts"
// // // // //       );
// // // // //       const userAttemptsSnap = await getDocs(userAttemptsRef);

// // // // //       let attempts = [];
// // // // //       for (let userAttempt of userAttemptsSnap.docs) {
// // // // //         const data = userAttempt.data();
// // // // //         const userId = data.userId;

// // // // //         let fullName = "";
// // // // //         try {
// // // // //           const userDoc = await getDoc(doc(db, "users", userId));
// // // // //           if (userDoc.exists()) {
// // // // //             const userData = userDoc.data();
// // // // //             fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
// // // // //           }
// // // // //         } catch (err) {
// // // // //           console.log("Error fetching user name:", err);
// // // // //         }

// // // // //         attempts.push({
// // // // //           email: data.email || "N/A",
// // // // //           name: fullName || "Unknown",
// // // // //           score: data.score || 0,
// // // // //           timeTaken: data.timeTaken || 0,
// // // // //           attempted: data.attempted || 0,
// // // // //           correct: data.correct || 0,
// // // // //           incorrect: data.incorrect || 0,
// // // // //           total: data.total || 0,
// // // // //         });
// // // // //       }

// // // // //       attempts.sort((a, b) => {
// // // // //         if (b.score === a.score) {
// // // // //           return a.timeTaken - b.timeTaken;
// // // // //         }
// // // // //         return b.score - a.score;
// // // // //       });

// // // // //       finalData.push({
// // // // //         testId,
// // // // //         testName,
// // // // //         attempts,
// // // // //       });
// // // // //     }

// // // // //     setLeaderboardData(finalData);
// // // // //   };

// // // // //   return (
// // // // //     <div className="withdrawal-container">
// // // // //       <h2 className="page-heading">
// // // // //         <BarChart3 size={28} style={{ marginRight: 8 }} />
// // // // //         Leaderboard
// // // // //       </h2>

// // // // //       {leaderboardData.map((test, index) => (
// // // // //         <div key={index} className="responsive-table">
// // // // //           <h3>{test.testName}</h3>
// // // // //           <div style={{ overflowX: "auto" }}>
// // // // //             <table className="withdrawal-table">
// // // // //               <thead>
// // // // //                 <tr>
// // // // //                   <th>Rank</th>
// // // // //                   <th>Name</th>
// // // // //                   <th>Email</th>
// // // // //                   <th>Score</th>
// // // // //                   <th>Time Taken (sec)</th>
// // // // //                   <th>Attempted</th>
// // // // //                   <th>Correct</th>
// // // // //                   <th>Incorrect</th>
// // // // //                   <th>Total</th>
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody>
// // // // //                 {test.attempts.length === 0 ? (
// // // // //                   <tr>
// // // // //                     <td colSpan="9" style={{ textAlign: "center", fontStyle: "italic", color: "#666" }}>
// // // // //                       No attempts yet.
// // // // //                     </td>
// // // // //                   </tr>
// // // // //                 ) : (
// // // // //                   test.attempts.map((entry, i) => (
// // // // //                     <tr key={i}>
// // // // //                       <td>{i + 1}</td>
// // // // //                       <td>{entry.name}</td>
// // // // //                       <td>{entry.email}</td>
// // // // //                       <td>{entry.score}</td>
// // // // //                       <td>{entry.timeTaken}</td>
// // // // //                       <td>{entry.attempted}</td>
// // // // //                       <td>{entry.correct}</td>
// // // // //                       <td>{entry.incorrect}</td>
// // // // //                       <td>{entry.total}</td>
// // // // //                     </tr>
// // // // //                   ))
// // // // //                 )}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           </div>
// // // // //         </div>
// // // // //       ))}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default Leaderboard;





// // // // // ✅ FILE: pages/Leaderboard.jsx

// // // // import React, { useEffect, useState } from "react";
// // // // import {
// // // //   collection,
// // // //   getDocs,
// // // //   doc,
// // // //   getDoc,
// // // // } from "firebase/firestore";
// // // // import { db } from "../firebase";
// // // // import { BarChart3 } from "lucide-react";
// // // // import "./Leaderboard.css";

// // // // const Leaderboard = () => {
// // // //   const [leaderboardData, setLeaderboardData] = useState([]);

// // // //   useEffect(() => {
// // // //     fetchAllLeaderboards();
// // // //   }, []);

// // // //   const fetchAllLeaderboards = async () => {
// // // //     const testsSnapshot = await getDocs(collection(db, "tests"));
// // // //     const finalData = [];

// // // //     for (let testDoc of testsSnapshot.docs) {
// // // //       const testId = testDoc.id;
// // // //       const testName = testDoc.data()?.name || "Unnamed Test";
// // // //       const userAttemptsRef = collection(db, "tests", testId, "userAttempts");
// // // //       const userAttemptsSnap = await getDocs(userAttemptsRef);

// // // //       let attempts = [];
// // // //       for (let userAttempt of userAttemptsSnap.docs) {
// // // //         const data = userAttempt.data();
// // // //         const userId = data.userId;

// // // //         let fullName = "";
// // // //         try {
// // // //           const userDoc = await getDoc(doc(db, "users", userId));
// // // //           if (userDoc.exists()) {
// // // //             const userData = userDoc.data();
// // // //             fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
// // // //           }
// // // //         } catch (err) {
// // // //           console.log("Error fetching user name:", err);
// // // //         }

// // // //         attempts.push({
// // // //           email: data.email || "N/A",
// // // //           name: fullName || "Unknown",
// // // //           score: data.score || 0,
// // // //           timeTaken: data.timeTaken || 0,
// // // //           attempted: data.attempted || 0,
// // // //           correct: data.correct || 0,
// // // //           incorrect: data.incorrect || 0,
// // // //           total: data.total || 0,
// // // //         });
// // // //       }

// // // //       attempts.sort((a, b) => {
// // // //         if (b.score === a.score) {
// // // //           return a.timeTaken - b.timeTaken;
// // // //         }
// // // //         return b.score - a.score;
// // // //       });

// // // //       finalData.push({
// // // //         testId,
// // // //         testName,
// // // //         attempts,
// // // //       });
// // // //     }

// // // //     setLeaderboardData(finalData);
// // // //   };

// // // //   return (
// // // //     <div className="withdrawal-container">
// // // //       <h2 className="page-heading" style={{ marginTop: "380px" }}>
// // // //   <BarChart3 size={28} style={{ marginRight: 8 }} />
// // // //   Leaderboard
// // // // </h2>


// // // //       {leaderboardData.map((test, index) => (
// // // //         <div key={index} className="responsive-table">
// // // //           <h3>{test.testName}</h3>
// // // //           <div style={{ overflowX: "auto" }}>
// // // //             <table className="withdrawal-table">
// // // //               <thead>
// // // //                 <tr>
// // // //                   <th>Rank</th>
// // // //                   <th>Name</th>
// // // //                   <th>Email</th>
// // // //                   <th>Score</th>
// // // //                   <th>Time Taken (sec)</th>
// // // //                   <th>Attempted</th>
// // // //                   <th>Correct</th>
// // // //                   <th>Incorrect</th>
// // // //                   <th>Total</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody>
// // // //                 {test.attempts.length === 0 ? (
// // // //                   <tr>
// // // //                     <td colSpan="9" style={{ textAlign: "center", fontStyle: "italic", color: "#666" }}>
// // // //                       No attempts yet.
// // // //                     </td>
// // // //                   </tr>
// // // //                 ) : (
// // // //                   test.attempts.map((entry, i) => (
// // // //                     <tr key={i}>
// // // //                       <td>{i + 1}</td>
// // // //                       <td>{entry.name}</td>
// // // //                       <td>{entry.email}</td>
// // // //                       <td>{entry.score}</td>
// // // //                       <td>{entry.timeTaken}</td>
// // // //                       <td>{entry.attempted}</td>
// // // //                       <td>{entry.correct}</td>
// // // //                       <td>{entry.incorrect}</td>
// // // //                       <td>{entry.total}</td>
// // // //                     </tr>
// // // //                   ))
// // // //                 )}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>
// // // //         </div>
// // // //       ))}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Leaderboard;



// // // import React, { useEffect, useState } from "react";
// // // import {
// // //   collection,
// // //   getDocs,
// // //   doc,
// // //   getDoc,
// // // } from "firebase/firestore";
// // // import { db } from "../firebase";
// // // import { BarChart3 } from "lucide-react";
// // // import "./Leaderboard.css";

// // // const Leaderboard = () => {
// // //   const [leaderboardData, setLeaderboardData] = useState([]);

// // //   useEffect(() => {
// // //     fetchAllLeaderboards();
// // //   }, []);

// // //   const fetchAllLeaderboards = async () => {
// // //     const testsSnapshot = await getDocs(collection(db, "tests"));
// // //     const finalData = [];

// // //     for (let testDoc of testsSnapshot.docs) {
// // //       const testId = testDoc.id;
// // //       const testName = testDoc.data()?.name || "Unnamed Test";
// // //       const userAttemptsRef = collection(db, "tests", testId, "userAttempts");
// // //       const userAttemptsSnap = await getDocs(userAttemptsRef);

// // //       let attempts = [];
// // //       for (let userAttempt of userAttemptsSnap.docs) {
// // //         const data = userAttempt.data();
// // //         const userId = data.userId;

// // //         let fullName = "";
// // //         try {
// // //           const userDoc = await getDoc(doc(db, "users", userId));
// // //           if (userDoc.exists()) {
// // //             const userData = userDoc.data();
// // //             fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
// // //           }
// // //         } catch (err) {
// // //           console.log("Error fetching user name:", err);
// // //         }

// // //         attempts.push({
// // //           email: data.email || "N/A",
// // //           name: fullName || "Unknown",
// // //           score: data.score || 0,
// // //           timeTaken: data.timeTaken || 0,
// // //           attempted: data.attempted || 0,
// // //           correct: data.correct || 0,
// // //           incorrect: data.incorrect || 0,
// // //           total: data.total || 0,
// // //         });
// // //       }

// // //       attempts.sort((a, b) => {
// // //         if (b.score === a.score) {
// // //           return a.timeTaken - b.timeTaken;
// // //         }
// // //         return b.score - a.score;
// // //       });

// // //       finalData.push({
// // //         testId,
// // //         testName,
// // //         attempts,
// // //       });
// // //     }

// // //     setLeaderboardData(finalData);
// // //   };

// // //   return (
// // //     <div style={{ padding: "20px", marginTop: "100px", color: "#000" }} className="withdrawal-container">
// // //       <h2 className="page-heading">
// // //         <BarChart3 size={28} style={{ marginRight: 8 }} />
// // //         Leaderboard
// // //       </h2>

// // //       {leaderboardData.map((test, index) => (
// // //         <div key={index} className="responsive-table">
// // //           <h3>{test.testName}</h3>
// // //           <div style={{ overflowX: "auto" }}>
// // //             <table className="withdrawal-table">
// // //               <thead>
// // //                 <tr>
// // //                   <th>Rank</th>
// // //                   <th>Name</th>
// // //                   <th>Email</th>
// // //                   <th>Score</th>
// // //                   <th>Time Taken (sec)</th>
// // //                   <th>Attempted</th>
// // //                   <th>Correct</th>
// // //                   <th>Incorrect</th>
// // //                   <th>Total</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {test.attempts.length === 0 ? (
// // //                   <tr>
// // //                     <td colSpan="9" style={{ textAlign: "center", fontStyle: "italic", color: "#666" }}>
// // //                       No attempts yet.
// // //                     </td>
// // //                   </tr>
// // //                 ) : (
// // //                   test.attempts.map((entry, i) => (
// // //                     <tr key={i}>
// // //                       <td>{i + 1}</td>
// // //                       <td>{entry.name}</td>
// // //                       <td>{entry.email}</td>
// // //                       <td>{entry.score}</td>
// // //                       <td>{entry.timeTaken}</td>
// // //                       <td>{entry.attempted}</td>
// // //                       <td>{entry.correct}</td>
// // //                       <td>{entry.incorrect}</td>
// // //                       <td>{entry.total}</td>
// // //                     </tr>
// // //                   ))
// // //                 )}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         </div>
// // //       ))}
// // //     </div>
// // //   );
// // // };

// // // export default Leaderboard;

// // import React, { useEffect, useState } from "react";
// // import {
// //   collection,
// //   getDocs,
// //   doc,
// //   getDoc,
// // } from "firebase/firestore";
// // import { db } from "../firebase";
// // import { BarChart3 } from "lucide-react";
// // import "./Leaderboard.css";

// // const Leaderboard = () => {
// //   const [leaderboardData, setLeaderboardData] = useState([]);

// //   useEffect(() => {
// //     fetchAllLeaderboards();
// //   }, []);

// //   const fetchAllLeaderboards = async () => {
// //     const testsSnapshot = await getDocs(collection(db, "tests"));
// //     const finalData = [];

// //     for (let testDoc of testsSnapshot.docs) {
// //       const testId = testDoc.id;
// //       const testName = testDoc.data()?.name || "Unnamed Test";
// //       const userAttemptsRef = collection(db, "tests", testId, "userAttempts");
// //       const userAttemptsSnap = await getDocs(userAttemptsRef);

// //       let attempts = [];
// //       for (let userAttempt of userAttemptsSnap.docs) {
// //         const data = userAttempt.data();
// //         const userId = data.userId;

// //         let fullName = "";
// //         try {
// //           const userDoc = await getDoc(doc(db, "users", userId));
// //           if (userDoc.exists()) {
// //             const userData = userDoc.data();
// //             fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
// //           }
// //         } catch (err) {
// //           console.log("Error fetching user name:", err);
// //         }

// //         attempts.push({
// //           email: data.email || "N/A",
// //           name: fullName || "Unknown",
// //           score: data.score || 0,
// //           timeTaken: data.timeTaken || 0,
// //           attempted: data.attempted || 0,
// //           correct: data.correct || 0,
// //           incorrect: data.incorrect || 0,
// //           total: data.total || 0,
// //         });
// //       }

// //       attempts.sort((a, b) => {
// //         if (b.score === a.score) {
// //           return a.timeTaken - b.timeTaken;
// //         }
// //         return b.score - a.score;
// //       });

// //       finalData.push({
// //         testId,
// //         testName,
// //         attempts,
// //       });
// //     }

// //     setLeaderboardData(finalData);
// //   };

// //   return (
// //     <div className="page-content-container">
// //       <h2 className="page-heading">
// //         <BarChart3 size={28} style={{ marginRight: 10 }} />
// //         Leaderboard
// //       </h2>

// //       {leaderboardData.map((test, index) => (
// //         <div key={index} className="responsive-table">
// //           <h3>{test.testName}</h3>
// //           <div style={{ overflowX: "auto" }}>
// //             <table className="withdrawal-table">
// //               <thead>
// //                 <tr>
// //                   <th>Rank</th>
// //                   <th>Name</th>
// //                   <th>Email</th>
// //                   <th>Score</th>
// //                   <th>Time Taken (sec)</th>
// //                   <th>Attempted</th>
// //                   <th>Correct</th>
// //                   <th>Incorrect</th>
// //                   <th>Total</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {test.attempts.length === 0 ? (
// //                   <tr>
// //                     <td colSpan="9" style={{ textAlign: "center", fontStyle: "italic", color: "#666" }}>
// //                       No attempts yet.
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   test.attempts.map((entry, i) => (
// //                     <tr key={i}>
// //                       <td>{i + 1}</td>
// //                       <td>{entry.name}</td>
// //                       <td>{entry.email}</td>
// //                       <td>{entry.score}</td>
// //                       <td>{entry.timeTaken}</td>
// //                       <td>{entry.attempted}</td>
// //                       <td>{entry.correct}</td>
// //                       <td>{entry.incorrect}</td>
// //                       <td>{entry.total}</td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default Leaderboard;




// import React, { useEffect, useState, useRef } from "react";
// import {
//   collection,
//   getDocs,
//   doc,
//   getDoc,
// } from "firebase/firestore";
// import { db } from "../firebase";
// import { BarChart3, Download } from "lucide-react";
// import "./Leaderboard.css";
// import html2pdf from "html2pdf.js";

// const Leaderboard = () => {
//   const [leaderboardData, setLeaderboardData] = useState([]);
//   const tableRefs = useRef({});

//   useEffect(() => {
//     fetchAllLeaderboards();
//   }, []);

//   const fetchAllLeaderboards = async () => {
//     const testsSnapshot = await getDocs(collection(db, "tests"));
//     const finalData = [];

//     for (let testDoc of testsSnapshot.docs) {
//       const testId = testDoc.id;
//       const testName = testDoc.data()?.name || "Unnamed Test";
//       const userAttemptsRef = collection(db, "tests", testId, "userAttempts");
//       const userAttemptsSnap = await getDocs(userAttemptsRef);

//       let attempts = [];
//       for (let userAttempt of userAttemptsSnap.docs) {
//         const data = userAttempt.data();
//         const userId = data.userId;

//         let fullName = "";
//         try {
//           const userDoc = await getDoc(doc(db, "users", userId));
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
//           }
//         } catch (err) {
//           console.log("Error fetching user name:", err);
//         }

//         attempts.push({
//           email: data.email || "N/A",
//           name: fullName || "Unknown",
//           score: data.score || 0,
//           timeTaken: data.timeTaken || 0,
//           attempted: data.attempted || 0,
//           correct: data.correct || 0,
//           incorrect: data.incorrect || 0,
//           total: data.total || 0,
//         });
//       }

//       attempts.sort((a, b) => {
//         if (b.score === a.score) {
//           return a.timeTaken - b.timeTaken;
//         }
//         return b.score - a.score;
//       });

//       finalData.push({
//         testId,
//         testName,
//         attempts,
//       });
//     }

//     setLeaderboardData(finalData);
//   };

//   const handleDownload = (testId, testName) => {
//     const element = tableRefs.current[testId];
//     if (!element) return;

//     const opt = {
//       margin: 0.5,
//       filename: `${testName}_Leaderboard.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
//     };

//     html2pdf().set(opt).from(element).save();
//   };

//   return (
//     <div className="page-content-container">
//       <h2 className="page-heading">
//         <BarChart3 size={28} style={{ marginRight: 8 }} />
//         Leaderboard
//       </h2>

//       {leaderboardData.map((test, index) => (
//         <div key={index} className="responsive-table">
//           <div className="test-header">
//             <h3>{test.testName}</h3>
//             <button
//               className="download-btn"
//               onClick={() => handleDownload(test.testId, test.testName)}
//             >
//               <Download size={16} style={{ marginRight: 6 }} />
//               Download PDF
//             </button>
//           </div>

//           <div
//             ref={(el) => (tableRefs.current[test.testId] = el)}
//             style={{ overflowX: "auto" }}
//           >
//             <table className="withdrawal-table">
//               <thead>
//                 <tr>
//                   <th>Rank</th>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Score</th>
//                   <th>Time Taken (sec)</th>
//                   <th>Attempted</th>
//                   <th>Correct</th>
//                   <th>Incorrect</th>
//                   <th>Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {test.attempts.length === 0 ? (
//                   <tr>
//                     <td colSpan="9" style={{ textAlign: "center", fontStyle: "italic", color: "#666" }}>
//                       No attempts yet.
//                     </td>
//                   </tr>
//                 ) : (
//                   test.attempts.map((entry, i) => (
//                     <tr key={i}>
//                       <td>{i + 1}</td>
//                       <td>{entry.name}</td>
//                       <td>{entry.email}</td>
//                       <td>{entry.score}</td>
//                       <td>{entry.timeTaken}</td>
//                       <td>{entry.attempted}</td>
//                       <td>{entry.correct}</td>
//                       <td>{entry.incorrect}</td>
//                       <td>{entry.total}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Leaderboard;






import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { BarChart3, Download } from "lucide-react";
import "./Leaderboard.css";
import html2pdf from "html2pdf.js";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const tableRefs = useRef({});

  useEffect(() => {
    fetchAllLeaderboards();
  }, []);

  const fetchAllLeaderboards = async () => {
    const testsSnapshot = await getDocs(collection(db, "tests"));
    const finalData = [];

    for (let testDoc of testsSnapshot.docs) {
      const testId = testDoc.id;
      const testName = testDoc.data()?.name || "Unnamed Test";
      const userAttemptsRef = collection(db, "tests", testId, "userAttempts");
      const userAttemptsSnap = await getDocs(userAttemptsRef);

      let attempts = [];
      for (let userAttempt of userAttemptsSnap.docs) {
        const data = userAttempt.data();
        const userId = data.userId;

        let fullName = "";
        try {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
          }
        } catch (err) {
          console.log("Error fetching user name:", err);
        }

        attempts.push({
          email: data.email || "N/A",
          name: fullName || "Unknown",
          score: data.score || 0,
          timeTaken: data.timeTaken || 0,
          attempted: data.attempted || 0,
          correct: data.correct || 0,
          incorrect: data.incorrect || 0,
          total: data.total || 0,
        });
      }

      attempts.sort((a, b) => {
        if (b.score === a.score) {
          return a.timeTaken - b.timeTaken;
        }
        return b.score - a.score;
      });

      finalData.push({
        testId,
        testName,
        attempts,
      });
    }

    setLeaderboardData(finalData);
  };

  const handleDownload = (testId, testName) => {
    const element = tableRefs.current[testId];
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `${testName}_Leaderboard.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="page-content-container">
      <h2 className="page-heading">
        <BarChart3 size={28} style={{ marginRight: 8 }} />
        Leaderboard
      </h2>

      {leaderboardData.map((test, index) => (
        <div key={index} className="responsive-table">
          <div className="test-header">
            <h3>{test.testName}</h3>
            <button
              className="download-btn"
              onClick={() => handleDownload(test.testId, test.testName)}
            >
              <Download size={16} style={{ marginRight: 6 }} />
              Download PDF
            </button>
          </div>

          {/* 🆕 This block below goes inside PDF */}
          <div
            ref={(el) => (tableRefs.current[test.testId] = el)}
            className="pdf-export-container"
          >
            <h2 className="pdf-title">{test.testName}</h2>
            <div style={{ overflowX: "auto" }}>
              <table className="withdrawal-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Score</th>
                    <th>Time Taken (sec)</th>
                    <th>Attempted</th>
                    <th>Correct</th>
                    <th>Incorrect</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {test.attempts.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: "center", fontStyle: "italic", color: "#666" }}>
                        No attempts yet.
                      </td>
                    </tr>
                  ) : (
                    test.attempts.map((entry, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{entry.name}</td>
                        <td>{entry.email}</td>
                        <td>{entry.score}</td>
                        <td>{entry.timeTaken}</td>
                        <td>{entry.attempted}</td>
                        <td>{entry.correct}</td>
                        <td>{entry.incorrect}</td>
                        <td>{entry.total}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
