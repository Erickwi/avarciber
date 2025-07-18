import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import DiamondSharpIcon from "@mui/icons-material/DiamondSharp";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import RuleIcon from "@mui/icons-material/Rule";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { FaCube } from "react-icons/fa";

const defaultIcons = {
  iconClosed: <RiIcons.RiArrowDownSFill />,
  iconOpened: <RiIcons.RiArrowUpSFill />,
};

export function getSidebarData(userRol) {
  return [
    {
      title: "Inicio",
      roles: ["Usuario", "Admin", "SuperAdmin"],
      icon: <AiIcons.AiFillHome />,
      ...defaultIcons,
      subNav: [
        { title: "General", path: "/inicio/general" },
      ],
    },
    {
      title: "Super Administrador",
      roles: ["SuperAdmin"],
      icon: <AiIcons.AiFillHome />,
      ...defaultIcons,
      subNav: [
        { title: "Gestionar Empresas", path: "/empresas/gestion" },
        { title: "Gestionar Cuentas", path: "/cuentas/gestion" },
      ],
    },
    {
      title: "Administrador",
      roles: ["Admin"],
      icon: <AiIcons.AiFillHome />,
      ...defaultIcons,
      subNav: [
        { title: "Gestionar Empleados", path: "/empleados/gestion" },
      ],
    },
    {
      title: "Parametrización",
      icon: <DiamondSharpIcon />,
      ...defaultIcons,
      subNav: [
        {
          title: "Gestión de Activos",
          icon: <DiamondSharpIcon />,
          ...defaultIcons,
          subNav: [
            { title: "Activos", path: "/medicion/activos" },
            { title: "Tipos de activos", path: "/parametrizacion/tipo-de-activos" },
          ],
        },
        {
          title: "Gestión de amenazas",
          icon: <DescriptionSharpIcon />,
          ...defaultIcons,
          subNav: [
            { title: "Amenazas", path: "/parametrizacion/amenazas" },
            { title: "Tipos de amenazas", path: "/parametrizacion/tipo-de-amenazas" },
          ],
        },
        {
          title: "Gestión de vulnerabilidades",
          icon: <ModeEditOutlineIcon />,
          ...defaultIcons,
          subNav: [
            { title: "Vulnerabilidades", path: "/parametrizacion/vulnerabilidades" },
            { title: "Tipos de vulnerabilidades", path: "/parametrizacion/tipo-de-vulnerabilidades" },
          ],
        },
        {
          title: "Probabilidades",
          icon: <RuleIcon />,
          path: "/parametrizacion/probabilidades",
        },
        {
          title: "Unidades",
          icon: <FaCube />,
          path: "/parametrizacion/unidades",
        },
      ],
    },
    {
      title: "Medición",
      icon: <RuleIcon />,
      ...defaultIcons,
      subNav: [
        { title: "Vulnerabilidad - Amenaza", path: "/gestionar/vulnerabilidad-amenaza", cName: "sub-nav" },
        { title: "Activo - Vulnerabilidad", path: "/gestionar/nuevo-proceso", cName: "sub-nav" },
      ],
    },
    {
      title: "Gestionar",
      icon: <ModeEditOutlineIcon />,
      ...defaultIcons,
      subNav: [
        { title: "Cálculo de Riesgo", path: "/gestionar/Calculo-Riesgo", cName: "sub-nav" },
      ],
    },
    {
      title: "Historico",
      icon: <DescriptionSharpIcon />,
      ...defaultIcons,
      subNav: [
        { title: "Historico de Procesos", path: "/gestionar/editar-vulnerabilidades", cName: "sub-nav" },
      ],
    },
  ].filter(item => !item.roles || item.roles.includes(userRol));
}