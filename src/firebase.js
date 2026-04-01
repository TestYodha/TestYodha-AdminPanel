import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseProjectConfigs = {
  primary: {
    appName: 'primary',
    label: 'test-yodha-01',
    config: {
      apiKey: 'AIzaSyB4AEEI215rFjys0gJaelaF-WTyGpJkhNE',
      authDomain: 'test-yodha-01.firebaseapp.com',
      projectId: 'test-yodha-01',
      storageBucket: 'test-yodha-01.firebasestorage.app',
      messagingSenderId: '73266695919',
      appId: '1:73266695919:web:c1549231a631bbcf39d51a',
    },
  },
};

const activeProjectKey = 'primary';
const activeProject = firebaseProjectConfigs[activeProjectKey];
const app = initializeApp(activeProject.config, activeProject.appName);

export const getActiveFirebaseProjectKey = () => activeProjectKey;

export const setActiveFirebaseProject = () => {};

export const getFirebaseServices = () => ({
  app,
  auth: getAuth(app),
  db: getFirestore(app),
  storage: getStorage(app),
  projectKey: activeProjectKey,
  projectLabel: activeProject.label,
});

const activeServices = getFirebaseServices();

export const auth = activeServices.auth;
export const db = activeServices.db;
export const storage = activeServices.storage;
export const firebaseProjects = firebaseProjectConfigs;
