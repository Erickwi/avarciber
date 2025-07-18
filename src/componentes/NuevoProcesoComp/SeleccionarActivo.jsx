import React, { useState, useEffect } from "react";
import Column from "../Column";
import { DragDropContext } from "react-beautiful-dnd";
import { styled } from "@stitches/react"; // Corregido el import
import { Button } from "@mui/material";
import { getActivos } from "../../services/activos/activosData";


const StyledColumns = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  margin: "5vh auto",
  width: "80%",
  height: "80vh",
  gap: "8px",
});

export default function SeleccionarActivo() {
  const [columns, setColumns] = useState({});

  const [lista, setLista] = useState([]);
  const [lista2, setLista2] = useState([]);
  const [listaBoolean, setListaBoolean] = useState(false);
  useEffect(() => {
    async function getLista() {
      try {
        const activosData = await getActivos();
        setLista(activosData);
        console.log(activosData);
        const newData = activosData.map((item) => item.ACT_NOMBRE);
        setColumns({
          Activos: {
            id: "Activos",
            list: newData,
          },
          Escoger: {
            id: "Escoger",
            list: [],
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
    getLista();
  }, []);

  const onDragEnd = ({ source, destination }) => {
    // Make sure we have a valid destination
    if (!destination) return;

    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return;

    // Set start and end variables
    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    if (end.id === "Escoger") {
      const transferredText = start.list[source.index];
      const matchingItem = lista.find(item => item.ACT_NOMBRE === transferredText);
      if (matchingItem) {
        console.log(`Transferring text "${transferredText}" with ACT_CODIGO: ${matchingItem.ACT_CODIGO}`);
        setLista2(prevLista2 => [...prevLista2, matchingItem.ACT_CODIGO]);
      } else {
        console.log(`No matching item found for text "${transferredText}"`);
      }
    } else if (end.id === "Activos") {
      const transferredText = start.list[source.index];
      const matchingItem = lista.find(item => item.ACT_NOMBRE === transferredText);
      if (matchingItem) {
        console.log(`Transferring back text "${transferredText}" with ACT_CODIGO: ${matchingItem.ACT_CODIGO}`);
        setLista2(prevLista2 => prevLista2.filter(item => item !== matchingItem.ACT_CODIGO));
      } else {
        console.log(`No matching item found for text "${transferredText}"`);
      }
    }

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start.list.filter((_, idx) => idx !== source.index);

      // Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index]);

      // Then create a new copy of the column object
      const newCol = {
        id: start.id,
        list: newList,
      };

      // Update the state
      setColumns((state) => ({ ...state, [newCol.id]: newCol }));
    } else {
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      const newStartList = start.list.filter((_, idx) => idx !== source.index);

      // Create a new start column
      const newStartCol = {
        id: start.id,
        list: newStartList,
      };

      // Make a new end list array
      const newEndList = end.list.slice();

      // Insert the item into the end list
      newEndList.splice(destination.index, 0, start.list[source.index]);

      // Create a new end column
      const newEndCol = {
        id: end.id,
        list: newEndList,
      };

      // Update the state
      setColumns((state) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      }));
    }
  };

  const handleEnviarClick = () => {
    console.log('lista2:', lista2);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StyledColumns>
        {Object.values(columns).map((col) => (
          <Column col={col} key={col.id} />
        ))}
      </StyledColumns>
      <Button onClick={handleEnviarClick}>Guardar</Button>
    </DragDropContext>
  );
}
