import { memo } from 'react';

import { Chats } from './Chats';
import { Navbar } from './Navbar';
import { Search } from './Search';

interface SidebarProps {}

export const Sidebar = memo((props: SidebarProps) => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
});
