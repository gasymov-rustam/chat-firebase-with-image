import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { FormEvent, memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AddAvatar } from '../assets';
import { auth, db, storage } from '../firebase';

export const Register = memo(() => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // @ts-ignore
    const displayName = e.target[0].value;
    // @ts-ignore
    const email = e.target[1].value;
    // @ts-ignore
    const password = e.target[2].value;
    // @ts-ignore
    const file = e.target[3].files[0];

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, displayName);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            // Update profile
            await updateProfile(response.user, {
              displayName,
              photoURL: downloadURL,
            });
            // create user on firestore
            await setDoc(doc(db, 'users', response.user.uid), {
              uid: response.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            // create empty user chats on firestore
            await setDoc(doc(db, 'userChats', response.user.uid), {});
            navigate('/');
            toast.info('🦄 Success!');
          } catch (error) {
            if (error instanceof FirebaseError) {
              const errorMessage = error.message;
              setError(errorMessage);
            }
          }
        });
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = error.message;
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">My Chat</span>
        <span className="title">Register</span>

        <form name="registerForm" onSubmit={handleSubmit}>
          <input type="text" placeholder="display name" name="username" />
          <input type="email" placeholder="email" name="email" />
          <input type="password" placeholder="password" name="password" />

          <label htmlFor="file">
            <input type="file" accept="image/*" hidden name="image" id="file" />
            <img src={AddAvatar} alt="Error" decoding="async" loading="lazy" />
            <span>Add an avatar</span>
          </label>
          <button>Sign Up</button>

          {error}
        </form>

        <p>
          Do you have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
});
