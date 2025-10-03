
// import { AppBar, Toolbar, Typography, Button } from "@mui/material";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useThemeMode } from "../context/ThemeContext";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase/firebaseConfig";
// import { useEffect, useState } from "react";

// const Navbar = () => {
//   const { mode } = useThemeMode();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setIsLoggedIn(!!user);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout Error:", error);
//       alert("Logout failed");
//     }
//   };

//   // Agar login page pr hai toh hide Navbar
//   if (location.pathname === "/login") return null;

//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         width: "100%",
//         background: mode === "dark"
//           ? "linear-gradient(90deg,rgba(12, 35, 239, 0.88),rgba(243, 236, 236, 0.84),rgba(7, 7, 7, 0.92))"
//           : "linear-gradient(90deg, #ffffff, #cccccc, #eeeeee)",
//         color: mode === "dark" ? "#fff" : "#000",
//         boxShadow: "none",
//         borderBottom: "1px solid #ddd",
//       }}
//     >
//       <Toolbar>
//         <Typography
//           variant="h6"
//           sx={{
//             flexGrow: 1,
//             cursor: "pointer",
//             transition: "0.3s",
//             "&:hover": {
//               color: mode === "dark" ? "#FFD700" : "#6200ea",
//             },
//           }}
//           onClick={() => navigate("/dashboard")}
//         >
//           Test Yodha Admin Panel
//         </Typography>

//         {isLoggedIn ? (
//           <Button
//             color="inherit"
//             onClick={handleLogout}
//             sx={{
//               transition: "0.3s",
//               "&:hover": {
//                 backgroundColor: mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
//                 color: mode === "dark" ? "#FF6347" : "#d32f2f",
//               },
//             }}
//           >
//             Logout
//           </Button>
//         ) : (
//           <Button
//             color="inherit"
//             onClick={() => navigate("/login")}
//             sx={{
//               transition: "0.3s",
//               "&:hover": {
//                 backgroundColor: mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
//                 color: mode === "dark" ? "#FFD700" : "#6200ea",
//               },
//             }}
//           >
//             Login
//           </Button>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;


import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useThemeMode } from "../context/ThemeContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { mode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Logout failed");
    }
  };

  // Agar login page pr hai toh hide Navbar
  if (location.pathname === "/login") return null;

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        background: mode === "dark"
          ? "linear-gradient(90deg,rgba(12, 35, 239, 0.88),rgba(243, 236, 236, 0.84),rgba(7, 7, 7, 0.92))"
          : "linear-gradient(90deg, #ffffff, #cccccc, #eeeeee)",
        color: mode === "dark" ? "#fff" : "#000",
        boxShadow: "none",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": {
              color: mode === "dark" ? "#FFD700" : "#6200ea",
            },
          }}
          onClick={() => navigate("/dashboard")}
        >
          Test Yodha Admin Panel
        </Typography>
        {/* <button color="inherit" onClick={() => navigate("/delete-course")} 
           sx={{
            transition: "0.3s",
            "&:hover": {
              backgroundColor: mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
              color: mode === "dark" ? "#FF6347" : "#d32f2f",
            },
          }}
          >
          Delete Course
        </button> */}
        <button
  onClick={() => navigate("/delete-course")}
  style={{
    backgroundColor: 'transparent',
    border: '2px solid #d32f2f',
    color: '#d32f2f',
    padding: '10px 20px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = 'rgba(211, 47, 47, 0.1)';
    e.target.style.transform = 'scale(1.05)';
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = 'transparent';
    e.target.style.transform = 'scale(1)';
  }}
>
  🗑️ Delete Course
</button>


        {isLoggedIn ? (
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{
              transition: "0.3s",
              "&:hover": {
                backgroundColor: mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                color: mode === "dark" ? "#FF6347" : "#d32f2f",
              },
            }}
          >
            Logout
          </Button>
        ) : (
          <Button
            color="inherit"
            onClick={() => navigate("/login")}
            sx={{
              transition: "0.3s",
              "&:hover": {
                backgroundColor: mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                color: mode === "dark" ? "#FFD700" : "#6200ea",
              },
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
