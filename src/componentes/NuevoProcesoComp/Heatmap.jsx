import React, { useState } from 'react';
import Column from '../Column';
import { DragDropContext } from 'react-beautiful-dnd';
import { styled } from '@stitches/react'; // Corregido el import

const StyledColumns = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  margin: '5vh auto',
  width: '80%',
  height: '80vh',
  gap: '8px'
});

function Heatmap() {
  const initialColumns = {
    Activos: {
      id: 'Activos',
      list: ['Computadora', 'Telefono', 'Monitor']
    },
    Escoger: {
      id: 'Escoger',
      list: []
    },

  };
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = ({ source, destination }) => {
    // Make sure we have a valid destination
    if (!destination) return;

    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) return;

    // Set start and end variables
    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start.list.filter(
        (_, idx) => idx !== source.index
      );

      // Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index]);

      // Then create a new copy of the column object
      const newCol = {
        id: start.id,
        list: newList
      };

      // Update the state
      setColumns(state => ({ ...state, [newCol.id]: newCol }));
    } else {
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      const newStartList = start.list.filter(
        (_, idx) => idx !== source.index
      );

      // Create a new start column
      const newStartCol = {
        id: start.id,
        list: newStartList
      };

      // Make a new end list array
      const newEndList = end.list.slice();

      // Insert the item into the end list
      newEndList.splice(destination.index, 0, start.list[source.index]);

      // Create a new end column
      const newEndCol = {
        id: end.id,
        list: newEndList
      };

      // Update the state
      setColumns(state => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol
      }));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StyledColumns>
        {Object.values(columns).map(col => (
          <Column col={col} key={col.id} />
        ))}
      </StyledColumns>
    </DragDropContext>
  );
}

export default Heatmap;
