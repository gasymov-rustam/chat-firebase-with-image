import { User, onAuthStateChanged } from 'firebase/auth';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { auth } from '../firebase';

export const AuthContext = createContext<{ currentUser: User | null }>({ currentUser: null });

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      subscribe();
    };
  }, []);

  const memoValue = useMemo(() => ({ currentUser }), [currentUser]);

  return <AuthContext.Provider value={memoValue}>{children}</AuthContext.Provider>;
};
