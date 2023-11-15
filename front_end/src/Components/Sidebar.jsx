import React from "react";
import { Link } from "react-router-dom";
import * as AiIcons from "react-icons/ai";
import { side_bar_items } from "./SidebarItems";
import "./Sidebar.css";
import { IconContext } from "react-icons";
import { useStore } from "../store";

function Sidebar({userId}) {
  const { dispatch } = useStore();

  const handleLogout = () => {
    dispatch({ type: "RESET_APPSTATE" });
  };

  return (
    <div>
      <IconContext.Provider value={{ color: "#ffffff" }}>
        <nav className="side-bar">
          <ul className="side-bar-items">
            <li className="app-name">
              <AiIcons.AiFillAliwangwang style={{ fontSize: "3rem" }} />
              <h1>Vibely</h1>
            </li>
            {side_bar_items(userId).map((item, index) => {
              return (
                <li key={index} className={item.class}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
            <li className="side-bar-text">
              <Link to="/signin" onClick={handleLogout}>
                {<AiIcons.AiOutlineDoubleLeft />}
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </div>
  );
}

export default Sidebar;
