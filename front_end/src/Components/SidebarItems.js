import React from "react";
import * as AiIcons from "react-icons/ai";

export const SidebarItems = [
  {
    title: "Home",
    path: "/home",
    icon: <AiIcons.AiOutlineHome />,
    class: "side-bar-text",
  },
  {
    title: "Inbox",
    path: "/inbox",
    icon: <AiIcons.AiOutlinePaperClip />,
    class: "side-bar-text",
  },
  {
    title: "Social Hub",
    path: "/social_hub",
    icon: <AiIcons.AiOutlineTeam />,
    class: "side-bar-text",
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <AiIcons.AiOutlineUser />,
    class: "side-bar-text",
  },
];
