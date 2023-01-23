import { FirebaseError } from 'firebase/app';
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { ChangeEvent, KeyboardEvent, memo, useState } from 'react';
import { toast } from 'react-toastify';

import { useAuth } from '../context/AuthContext';
import { ChatActionKind, useChatContext } from '../context/ChatContext';
import { db } from '../firebase';

export const Search = memo(() => {
  const { currentUser } = useAuth();
  const { dispatch } = useChatContext();
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<DocumentData | null>(null);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSearch = async () => {
    const q = query(collection(db, 'users'), where('displayName', '==', username));

    try {
      const query = await getDocs(q);

      if (query) {
        query.forEach((doc) => {
          setUser(doc.data());
        });
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = error.message;
        setError(errorMessage);
      }
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = async () => {
    if (user && currentUser) {
      // check whether the group(chats in firestore) exists, if not create
      const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

      try {
        const res = await getDoc(doc(db, 'chats', combinedId));

        if (!res.exists()) {
          // create a chat in chats collection
          await setDoc(doc(db, 'chats', combinedId), { messages: [] });

          // create user chats
          await updateDoc(doc(db, 'userChats', currentUser.uid), {
            [`${combinedId}.userInfo`]: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            [`${combinedId}.date`]: serverTimestamp(),
          });

          await updateDoc(doc(db, 'userChats', user.uid), {
            [`${combinedId}.userInfo`]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            [`${combinedId}.date`]: serverTimestamp(),
          });
        }
      } catch (error) {
        if (error instanceof FirebaseError) {
          const errorMessage = error.message;
          toast.error(errorMessage);
        }
      }

      dispatch({ type: ChatActionKind.CHANGE_USER, payload: { currentUserId: currentUser?.uid, user } });
    }

    setUser(null);
    setUsername('');
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          name="search"
          placeholder="find a user"
          value={username}
          onKeyDown={handleKey}
          onChange={handleChange}
        />
      </div>

      {error}

      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user?.photoUrl} alt="Error" width={50} height={50} decoding="async" loading="lazy" />

          <div className="userChatInfo">
            <span>{user?.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
});
