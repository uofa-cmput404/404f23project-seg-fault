import React from 'react';
import { Link } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import { SidebarItems } from './SidebarItems';
import './Sidebar.css';
import { IconContext } from 'react-icons';

function Sidebar() {
  return (
    <div>
      <IconContext.Provider value={{ color: '#ffffff' }}>
        <nav className='side-bar'>
          <ul className='side-bar-items'>
            <li className='app-name'>
              <AiIcons.AiFillAliwangwang style={{ fontSize: '3rem' }}/>
              <h1>Vibely</h1>
            </li>
            {SidebarItems.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </div>
  );
}

export default Sidebar;