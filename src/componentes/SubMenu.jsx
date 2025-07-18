import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    background: #005b96;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownContainer = styled.div`
  background: #014a81;
`;

const DropdownLink = styled(Link)`
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;
  &:hover {
    background: #1976d2;
  }
`;

const SubMenu = ({ item, closeSidebar }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = (e) => {
    // Solo abrir/cerrar si tiene subNav
    if (item.subNav) {
      e.preventDefault();
      setSubnav(!subnav);
    } else if (closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <>
      <SidebarLink to={item.path || "#"} onClick={showSubnav}>
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && (subnav ? item.iconOpened : item.iconClosed)}
        </div>
      </SidebarLink>
      {subnav && item.subNav && (
        <DropdownContainer>
          {item.subNav.map((subItem, index) =>
            subItem.subNav ? (
              // Llamada recursiva para submenús anidados
              <SubMenu item={subItem} key={index} closeSidebar={closeSidebar} />
            ) : (
              <DropdownLink
                to={subItem.path}
                key={index}
                onClick={closeSidebar}
              >
                {subItem.icon}
                <SidebarLabel>{subItem.title}</SidebarLabel>
              </DropdownLink>
            )
          )}
        </DropdownContainer>
      )}
    </>
  );
};

export default SubMenu;