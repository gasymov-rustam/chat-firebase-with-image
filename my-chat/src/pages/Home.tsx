import { memo } from 'react';

import { Chat, Sidebar } from '../components';

export const Home = memo(() => {
  return (
    <div className="home">
      <div className="container">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
});
