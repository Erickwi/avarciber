import React from "react";
import GridComponent from "../componentes/structGrid";
import { AiOutlineFund } from "react-icons/ai";
import { AiOutlineBarChart } from "react-icons/ai";
import ComboBoxWithSearch from "../componentes/ComboBoxWithSearch";
import ComboBoxActivo from "../componentes/ComboBoxActivo";
import ComboBoxTipoActivo from "../componentes/ComboBoxTipoActivo";
import Tabla from "../componentes/TablaActivo";
import Tabla1 from "../componentes/TablaValorImpacto";
import { Box } from "@mui/material";

export const Activos = () => {
  const [unidadSeleccionada, setUnidadSeleccionada] = React.useState(null);
  const [tipoActivoSeleccionado, setTipoActivoSeleccionado] =
    React.useState(null);
  const [activoSeleccionado, setActivoSeleccionado] = React.useState(null);

  const handleUnidadChange = (selectedUnidad) => {
    setUnidadSeleccionada(selectedUnidad);
  };

  // Función para manejar los cambios en la selección de tipo de activo
  const handleTipoActivoChange = (selectedTipoActivo) => {
    setTipoActivoSeleccionado(selectedTipoActivo);
  };

  // Función para manejar los cambios en la selección de activo
  const handleActivoChange = (selectedActivo) => {
    setActivoSeleccionado(selectedActivo);
  };

  return (
    <Box m="20px">
      <div className="overview">
        <GridComponent>
          <div>
            <AiOutlineFund
              icon={AiOutlineFund}
              size={48}
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            Listado de activos por unidad y tipo
          </div>
          {/* Contenido de la celda 2 */}
          <div>
            Activos y características
            <br></br>
            <br></br>
            <ComboBoxWithSearch
              label="Organización (Unidad)"
              onChange={handleUnidadChange}
            />
            <br></br>
            <ComboBoxTipoActivo
              label="Tipo de Activo"
              onChange={handleTipoActivoChange}
            />
            <br></br>
            <ComboBoxActivo label="Activo" onChange={handleActivoChange} />
          </div>
          {/* Contenido de la celda 3 */}
          <div>
            <Tabla tableTitle="Vulnerabilidades por Activo"></Tabla>
          </div>
        </GridComponent>
      </div>
    </Box>
  );
};

export const ValDeImpac = () => {
  const [unidadSeleccionada, setUnidadSeleccionada] = React.useState(null);
  const [tipoActivoSeleccionado, setTipoActivoSeleccionado] =
    React.useState(null);
  const [activoSeleccionado, setActivoSeleccionado] = React.useState(null);

  const handleUnidadChange = (selectedUnidad) => {
    setUnidadSeleccionada(selectedUnidad);
  };

  // Función para manejar los cambios en la selección de tipo de activo
  const handleTipoActivoChange = (selectedTipoActivo) => {
    setTipoActivoSeleccionado(selectedTipoActivo);
  };

  // Función para manejar los cambios en la selección de activo
  const handleActivoChange = (selectedActivo) => {
    setActivoSeleccionado(selectedActivo);
  };
  return (
    <Box mt={2} mr={2} ml={2}>
      <div className="general">
        <GridComponent>
          <div>
            <AiOutlineBarChart
              icon={AiOutlineBarChart}
              size={40}
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            Activos: Valor de Impacto
          </div>
          {/* Contenido de la celda 2 */}
          <div>
            Activos y características
            <br></br>
            <br></br>
            <ComboBoxWithSearch
              label="Organización (Unidad)"
              onChange={handleUnidadChange}
            />
            <br></br>
            <ComboBoxTipoActivo
              label="Tipo de Activo"
              onChange={handleTipoActivoChange}
            />
            <br></br>
            <ComboBoxActivo label="Activo" onChange={handleActivoChange} />
          </div>
          {/* Contenido de la celda 3 */}
          <div>
            <Tabla1
              tableTitle="Vulnerabilidades para el Activo:"
              unidadSeleccionada={unidadSeleccionada}
              tipoActivoSeleccionado={tipoActivoSeleccionado}
              activoSeleccionado={activoSeleccionado}
            />
          </div>
          <br></br>
          <br></br>
        </GridComponent>
      </div>
    </Box>
  );
};
