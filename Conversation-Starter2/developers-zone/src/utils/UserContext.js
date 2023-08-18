import { createContext } from 'react';

const UserContext = createContext({
  isPremium: false,
  setIsPremium: () => {},
});

export default UserContext;