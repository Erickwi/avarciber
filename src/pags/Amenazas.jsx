import React from 'react';
import GridComponent from '../componentes/structGrid';
import { AiOutlineFund } from "react-icons/ai";
import ComboBoxWithSearch from '../componentes/ComboBoxWithSearch';
import Tabla from '../componentes/TablaAmenaza';

export const ProbPorAm = () => {
  return (
    <div className='overview'>
      <GridComponent>
          <div>
            <AiOutlineFund icon={AiOutlineFund} size={48} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            Probilidad de las Amenazas por unidad y tipo
          </div>
          {/* Contenido de la celda 2 */}
          <div>
            Activos y características
            <br></br>
            <br></br>
            <ComboBoxWithSearch label="Organización(Unidad)"/>
            <br></br>
            <ComboBoxWithSearch label="Tipo de Amenaza"/>
          </div>
          {/* Contenido de la celda 3 */}
          <div>
           <Tabla tableTitle="Probabilida por Amenaza"></Tabla>
          </div>
        </GridComponent>
    </div>
  );
};




