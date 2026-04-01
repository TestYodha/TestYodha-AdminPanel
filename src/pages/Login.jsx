import React, { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import {
  firebaseProjects,
  getActiveFirebaseProjectKey,
  getFirebaseServices,
  setActiveFirebaseProject,
} from '../firebase';
import '../styles/Login.css';

const getLoginErrorMessage = (error, projectLabel = 'current project') => {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'Email format invalid hai.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return `${projectLabel} Firebase Auth ne is email/password ko accept nahi kiya. Iska matlab account is project me nahi hai ya password mismatch hai.`;
    case 'auth/too-many-requests':
      return 'Bahut zyada failed attempts hue hain. Thodi der baad try karo.';
    case 'permission-denied':
    case 'firestore/permission-denied':
      return 'Admin verification ke liye Firestore read blocked hai.';
    default:
      return error?.message || 'Login failed.';
  }
};

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const checkAdminAccess = async (db, user) => {
  const directAdminDoc = await getDoc(doc(db, 'admins', user.uid));
  if (directAdminDoc.exists()) {
    return { ok: true, matchedBy: 'uid-doc' };
  }

  const adminByUidQuery = query(
    collection(db, 'admins'),
    where('uid', '==', user.uid),
    limit(1)
  );
  const adminByUidSnapshot = await getDocs(adminByUidQuery);
  if (!adminByUidSnapshot.empty) {
    return { ok: true, matchedBy: 'uid-field' };
  }

  const normalizedEmail = normalizeEmail(user.email);
  if (!normalizedEmail) {
    return { ok: false, reason: 'Signed-in user ke paas email value nahi mili.' };
  }

  const emailDoc = await getDoc(doc(db, 'admins', normalizedEmail));
  if (emailDoc.exists()) {
    return { ok: true, matchedBy: 'email-doc' };
  }

  const emailCandidates = [...new Set([normalizedEmail, user.email].filter(Boolean))];

  for (const emailCandidate of emailCandidates) {
    const adminByEmailQuery = query(
      collection(db, 'admins'),
      where('email', '==', emailCandidate),
      limit(1)
    );
    const adminByEmailSnapshot = await getDocs(adminByEmailQuery);

    if (!adminByEmailSnapshot.empty) {
      return { ok: true, matchedBy: 'email-field' };
    }
  }

  return {
    ok: false,
    reason: `Auth success hua, but admins collection me uid/email match nahi mila for ${normalizedEmail}.`,
  };
};

const getProjectTryOrder = () => {
  const activeProjectKey = getActiveFirebaseProjectKey();
  const allProjectKeys = Object.keys(firebaseProjects);
  const remainingKeys = allProjectKeys.filter((key) => key !== activeProjectKey);

  return [activeProjectKey, ...remainingKeys];
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const normalizedEmail = normalizeEmail(email);
      const projectKeysToTry = getProjectTryOrder();
      let lastAuthError = null;
      let lastAuthProjectLabel = null;
      const verificationFailures = [];

      for (const projectKey of projectKeysToTry) {
        const { auth, db, projectLabel } = getFirebaseServices(projectKey);

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            normalizedEmail,
            password
          );
          const { user } = userCredential;

          const adminAccess = await checkAdminAccess(db, user);

          if (!adminAccess.ok) {
            await signOut(auth);
            verificationFailures.push({
              projectLabel,
              reason: adminAccess.reason,
            });
            continue;
          }

          setActiveFirebaseProject(projectKey);
          console.info(`Login verified via ${projectLabel} (${adminAccess.matchedBy})`);
          window.location.replace('/dashboard');
          return;
        } catch (error) {
          if (
            error?.code === 'permission-denied' ||
            error?.code === 'firestore/permission-denied'
          ) {
            verificationFailures.push({
              projectLabel,
              reason: 'Firestore rules admins collection read ko block kar rahi hain.',
            });
            continue;
          }

          if (
            error?.code === 'auth/user-not-found' ||
            error?.code === 'auth/wrong-password' ||
            error?.code === 'auth/invalid-credential'
          ) {
            lastAuthError = error;
            lastAuthProjectLabel = projectLabel;
            continue;
          }

          throw error;
        }
      }

      if (verificationFailures.length > 0) {
        console.warn('Admin verification failed:', verificationFailures);
        const failureMessage = verificationFailures
          .map((failure) => `${failure.projectLabel}: ${failure.reason}`)
          .join('\n');

        alert(`Login hua tha, but admin verification fail ho gaya:\n${failureMessage}`);
        return;
      }

      if (lastAuthError) {
        console.error('Login Error:', lastAuthError);
        alert(getLoginErrorMessage(lastAuthError, lastAuthProjectLabel));
        return;
      }

      alert('Access denied. Is account ka admin record kisi configured project me nahi mila.');
    } catch (error) {
      console.error('Login Error:', error);
      alert(getLoginErrorMessage(error));
    } finally {
      setSubmitting(false);
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
          autoComplete="username"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
