import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Box from '@mui/material/Box';

const StyledItem = {
  backgroundColor: '#eee',
  borderRadius: 3,
  padding: '4px 8px',
  transition: 'background-color .8s ease-out',
    marginBottom: 1,
  ':hover': {
    backgroundColor: '#c7c2c2',
    transition: 'background-color .1s ease-in',
  },
};

const Item = ({ text, index }) => {
  return (
    <Draggable draggableId={text} index={index}>
      {(provided) => (
        <Box
          sx={{
            ...StyledItem,
            ...provided.draggableProps.style,
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {text}
        </Box>
      )}
    </Draggable>
  );
};

export default Item;
