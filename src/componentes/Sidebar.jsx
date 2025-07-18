import React, { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import { getSidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import logo from '../images/logoAvar.svg';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useAuth } from "../context/AuthContext";
import Typography from '@mui/material/Typography';
import { getLogoEmpresaByUserId } from '../services/empresas/empresasData';

const Nav = styled.div`
  background: linear-gradient(to right, #03396c, #005b96);
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  padding: 20px;
`;

const LogoImg = styled.img`
  height: 40px;
  padding-right: 20px;
`;

const NavIcon = styled(Link)`
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
`;

const PersonIconContainer = styled.div`
  position: relative;
`;

const PersonIcon = styled.div`
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const SubmenuContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #03396c;
  width: 200px;
  display: ${({ showSubmenu }) => (showSubmenu ? "block" : "none")};
  z-index: 11;
`;

const SubmenuOption = styled.div`
  padding: 10px;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: #03396c;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  display: ${({ showSubmenu }) => (showSubmenu ? 'block' : 'none')};
  z-index: 10;
`;

const SidebarNav = styled.nav`
  background: linear-gradient(to bottom, #03396c, #03396c, #005b96);  
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  transition: 350ms;
  z-index: 10;
  overflow-y: auto;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;
const GlobalStyle = createGlobalStyle`
  body {
    margin-left: ${({ sidebar }) => (sidebar ? '250px' : '0')};
    transition: margin-left 350ms;
  }
`;

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const personIconRef = useRef(null);
  const { logout, isAuthenticated, errors: registerErrors, user, userReady } = useAuth();
  const showSidebar = () => setSidebar(!sidebar);
  const closeSidebar = () => setSidebar(false);
  const toggleSubmenu = () => setShowSubmenu(!showSubmenu);
  const [empresaLogo, setEmpresaLogo] = useState(null);
  const userRol = user?.usu_rol || user?.rol || "";
  const sidebarData = getSidebarData(userRol);

  useEffect(() => {
    const codigo = user?.usu_codigo || user?.id;
    if (userReady && user && codigo) {
      const fetchLogo = async () => {
        try {
          const res = await getLogoEmpresaByUserId(user.usu_codigo);
          setEmpresaLogo(res.data.emp_logo);
        } catch (error) {
          setEmpresaLogo(null);
        }
      };
      fetchLogo();
    } else {
      setEmpresaLogo(null);
    }
  }, [user, userReady]);

  return (
    <>
      {isAuthenticated ? (
        <IconContext.Provider value={{ color: '#fff' }}>
          <GlobalStyle sidebar={sidebar} />
          <Nav>
            <NavIcon to="#">
              <FaIcons.FaBars onClick={showSidebar} />
            </NavIcon>
            <PersonIconContainer ref={personIconRef}>
              {user ? (
                <div className="user-name-container">
                  <Typography variant="body1" style={{ color: '#fff', marginRight: '6vw' }}>
                    Holaa, {user.nombre ? `${user.nombre} ${user.apellido}` : `${user.usu_nombre} ${user.usu_apellido}`}
                  </Typography>
                </div>
              ) : null}
              <PersonIcon onClick={toggleSubmenu} style={{ color: '#fff', marginLeft: '10vw', marginTop: '-2rem' }}>
                <FaIcons.FaUser onClick={closeSidebar} />
              </PersonIcon>
              <SubmenuContainer
                showSubmenu={showSubmenu}
                style={{
                  top: personIconRef.current?.getBoundingClientRect().bottom,
                }}
              >
                {isAuthenticated ? (
                  <SubmenuOption onClick={logout}>Cerrar Sesión</SubmenuOption>
                ) : (
                  <SubmenuOption onClick={() => (window.location.href = "/login")}>Iniciar Sesión</SubmenuOption>
                )}
              </SubmenuContainer>
            </PersonIconContainer>
          </Nav>
          <SidebarNav sidebar={sidebar}>
            <SidebarWrap>
              <NavIcon>
                <LogoContainer>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <LogoImg src={logo} alt="Logo Avar" />
                    {empresaLogo ? (
                      <img src={empresaLogo} alt="Logo Empresa" style={{ height: 40, borderRadius: 8, marginLeft: 12 }} />
                    ) : (
                      <span style={{ color: "#fff", marginLeft: 12, fontWeight: 500 }}>Sin logo</span>
                    )}
                  </div>
                  <ArrowBackIosNewIcon onClick={closeSidebar} style={{ marginLeft: '6vh', color: '#FFFFFF' }} />
                </LogoContainer>
              </NavIcon>
              {sidebarData.map((item, index) => (
                <SubMenu item={item} key={index} closeSidebar={closeSidebar} />
              ))}
            </SidebarWrap>
          </SidebarNav>
          <Backdrop showSubmenu={showSubmenu} onClick={toggleSubmenu} />
        </IconContext.Provider>
      ) : (
        null
      )}
    </>
  );
};

export default Sidebar;