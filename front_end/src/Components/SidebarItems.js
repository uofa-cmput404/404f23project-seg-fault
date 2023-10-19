import React from 'react';
import * as AiIcons from 'react-icons/ai';

export const SidebarItems = [
  {
    title: 'Home',
    path: '/home',
    icon: <AiIcons.AiOutlineHome />,
    cName: 'side-bar-text'
  },
  {
    title: 'Inbox',
    path: '/inbox',
    icon: <AiIcons.AiOutlinePaperClip />,
    cName: 'side-bar-text'
  },
  {
    title: 'Friends',
    path: '/friends',
    icon: <AiIcons.AiOutlineTeam />,
    cName: 'side-bar-text'
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: <AiIcons.AiOutlineUser />,
    cName: 'side-bar-text'
  },
];