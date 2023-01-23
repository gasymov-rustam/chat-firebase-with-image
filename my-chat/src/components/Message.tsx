import { DocumentData } from 'firebase/firestore';
import { memo, useEffect, useRef } from 'react';

import { useAuth } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';

interface MessageProps {
  message: DocumentData;
}

export const Message = memo((props: MessageProps) => {
  const { message } = props;
  const { currentUser } = useAuth();
  const { data } = useChatContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser?.uid && 'owner'}`}>
      <div className="messageInfo">
        <img
          src={message.senderId === currentUser?.uid ? currentUser?.photoURL : data.user.photoURL}
          alt="Error"
          decoding="async"
          loading="lazy"
        />

        <span>just now</span>
      </div>

      <div className="messageContent">
        <p>{message.text}</p>

        {message.img && <img src={message.img} alt="Error" decoding="async" loading="lazy" />}
      </div>
    </div>
  );
});
