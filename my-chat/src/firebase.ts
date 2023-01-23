import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDO5y-govUXJbKPdacZX9bIOZPaqYZQ0aA',
  authDomain: 'chat-e3fb2.firebaseapp.com',
  projectId: 'chat-e3fb2',
  storageBucket: 'chat-e3fb2.appspot.com',
  messagingSenderId: '560306043726',
  appId: '1:560306043726:web:58f8fb30bcceeaee1bfc1f',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
