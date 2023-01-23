import { DocumentData, doc, onSnapshot } from 'firebase/firestore';
import { memo, useEffect, useState } from 'react';

import { useChatContext } from '../context/ChatContext';
import { db } from '../firebase';

import { Message } from './Message';

interface MessagesProps {}

export const Messages = memo((props: MessagesProps) => {
  const [messages, setMessages] = useState<DocumentData>([]);
  const { data } = useChatContext();

  useEffect(() => {
    const unSubscribe = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages);
      }
    });

    return () => {
      unSubscribe();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.map((message: DocumentData) => {
        return <Message key={messages.uid} message={message} />;
      })}
    </div>
  );
});
