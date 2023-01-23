import { memo } from 'react';

import { Add, Cam, More } from '../assets';
import { useChatContext } from '../context/ChatContext';

import { Input } from './Input';
import { Messages } from './Messages';

interface ChatProps {}

export const Chat = memo((props: ChatProps) => {
  const {
    data: { user },
  } = useChatContext();

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{user?.displayName}</span>

        <div className="chatIcons">
          <img src={Cam} alt="Error" decoding="async" loading="lazy" />
          <img src={Add} alt="Error" decoding="async" loading="lazy" />
          <img src={More} alt="Error" decoding="async" loading="lazy" />
        </div>
      </div>

      <Messages />
      <Input />
    </div>
  );
});
