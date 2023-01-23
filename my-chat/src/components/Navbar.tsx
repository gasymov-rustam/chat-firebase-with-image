import { signOut } from 'firebase/auth';
import { memo } from 'react';
import { toast } from 'react-toastify';

import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';

export const Navbar = memo(() => {
  const { currentUser } = useAuth();
  const onLogOut = () => {
    signOut(auth);
    toast.info('Success logout!');
  };

  return (
    <div className="navbar">
      <span className="logo">My Chat</span>

      <div className="user">
        <img src={currentUser?.photoURL?.toString()} alt="Error" decoding="async" loading="lazy" />
        <span>{currentUser?.displayName}</span>
        <button onClick={onLogOut}>Log Out</button>
      </div>
    </div>
  );
});
