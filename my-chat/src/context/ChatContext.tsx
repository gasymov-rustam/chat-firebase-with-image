import { DocumentData } from 'firebase/firestore';
import { Dispatch, ReactNode, Reducer, ReducerAction, createContext, useContext, useMemo, useReducer } from 'react';

import { useAuth } from './AuthContext';

interface IUserState {
  chatId: string;
  user: DocumentData;
}

interface IInitialState {
  data: IUserState;
  dispatch: Dispatch<ChatAction>;
}

export enum ChatActionKind {
  CHANGE_USER = 'change_user',
}

interface ChatAction {
  type: ChatActionKind;
  payload: { user: DocumentData; currentUserId: string };
}

const chatReducer = (state: IUserState, { type, payload }: ChatAction) => {
  return type === ChatActionKind.CHANGE_USER
    ? {
        user: payload.user,
        chatId:
          payload.currentUserId > payload.user.uid
            ? payload.currentUserId + payload.user.uid
            : payload.user.uid + payload.currentUserId,
      }
    : state;
};

const INITIAL_STATE: IInitialState = {
  data: { chatId: '', user: {} },
  dispatch: () => INITIAL_STATE,
};

const ChatContext = createContext<IInitialState>({ data: { chatId: '', user: {} }, dispatch: () => {} });

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, { chatId: '', user: {} });

  const memoValue = useMemo(() => ({ data: state, dispatch }), [state]);

  return <ChatContext.Provider value={memoValue}>{children}</ChatContext.Provider>;
};
