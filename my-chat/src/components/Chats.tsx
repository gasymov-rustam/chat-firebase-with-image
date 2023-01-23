import { Unsubscribe } from 'firebase/auth';
import { DocumentData, doc, onSnapshot } from 'firebase/firestore';
import { memo, useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { ChatActionKind, useChatContext } from '../context/ChatContext';
import { db } from '../firebase';

export const Chats = memo(() => {
  const { currentUser } = useAuth();
  const { dispatch } = useChatContext();
  const [chats, setChats] = useState<DocumentData>();

  useEffect(() => {
    const getChats = () => {
      let unsubscribe: Unsubscribe;

      if (currentUser?.uid) {
        unsubscribe = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
          setChats(doc?.data());
        });
      }

      return () => {
        unsubscribe();
      };
    };

    if (currentUser?.uid) {
      getChats();
    }
  }, [currentUser?.uid]);

  const handleSelect = (user: DocumentData) => () => {
    if (currentUser?.uid) {
      dispatch({ type: ChatActionKind.CHANGE_USER, payload: { currentUserId: currentUser?.uid, user } });
    }
  };

  return (
    <div className="chats">
      {chats &&
        Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          ?.map(([path, data]) => {
            return (
              <div className="userChat" key={path} onClick={handleSelect(data?.userInfo)}>
                <img
                  src={data?.userInfo?.photoUrl}
                  alt="Error"
                  width={50}
                  height={50}
                  decoding="async"
                  loading="lazy"
                />

                <div className="userChatInfo">
                  <span>{data?.userInfo?.displayName}</span>
                  <p>{data?.lastMessage?.text}</p>
                </div>
              </div>
            );
          })}
    </div>
  );
});
