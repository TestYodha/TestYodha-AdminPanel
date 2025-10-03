

// import React, { useState } from 'react';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from '../firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import '../styles/Login.css';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       const adminRef = doc(db, 'admins', user.uid);
//       const adminSnap = await getDoc(adminRef);
//       if (adminSnap.exists()) {
//         navigate('/dashboard');
//       } else {
//         alert('Access denied!');
//         await auth.signOut();
//       }
//     } catch (error) {
//       alert('Login failed! Check your credentials.');
//     }
//   };

//   return (
//     <div className="login-container">
//       <img src="/textlogo.png" alt="Test Yodha Logo" className="main-logo" />
//       <div className="login-box">
//         <h2>Admin Login Panel</h2>
//         <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//         <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
//         <button onClick={handleLogin}>Login</button>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent page reload on Enter
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const adminRef = doc(db, 'admins', user.uid);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        navigate('/dashboard');
      } else {
        alert('Access denied!');
        await auth.signOut();
      }
    } catch (error) {
      alert('Login failed! Check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <img src="/textlogo.png" alt="Test Yodha Logo" className="main-logo" />

      <form className="login-box" onSubmit={handleLogin}>
        <h2>Admin Login Panel</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
