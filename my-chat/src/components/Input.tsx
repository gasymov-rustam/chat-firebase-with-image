import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { ChangeEvent, FormEvent, memo, useState } from 'react';
import { v4 } from 'uuid';

import { Attach, Img } from '../assets';
import { useAuth } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';
import { db, storage } from '../firebase';

export const Input = memo(() => {
  const [text, setText] = useState('');
  const [img, setImg] = useState<File | null>(null);
  const { currentUser } = useAuth();
  const { data } = useChatContext();

  const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImg(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, v4());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        _,
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: v4(),
                text,
                senderId: currentUser?.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        },
      );
    } else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        id: v4(),
        text,
        senderId: currentUser?.uid,
        date: Timestamp.now(),
      });
    }

    await updateDoc(doc(db, 'userChats', currentUser?.uid ?? v4()), {
      [`${data.chatId}.lastMessage`]: {
        text,
      },
      [`${data.chatId}.date`]: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [`${data.chatId}.lastMessage`]: {
        text,
      },
      [`${data.chatId}.date`]: serverTimestamp(),
    });

    setText('');
    setImg(null);
  };

  return (
    <div className="input">
      <input type="text" name="message-text" placeholder="Type something..." value={text} onChange={handleChangeText} />

      <div className="send">
        <img src={Attach} alt="Error" decoding="async" loading="lazy" />

        <label htmlFor="image-send">
          <img src={Img} alt="Error" width={70} decoding="async" loading="lazy" />
          <input type="file" name="image-send" id="image-send" hidden onChange={handleChangeFile} />
        </label>

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
});
