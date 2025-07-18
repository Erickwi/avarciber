import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Typography, Tooltip, Chip, Divider } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import SecurityIcon from "@mui/icons-material/Security";

const StyledColumn = {
  display: "flex",
  flexDirection: "column",
  minWidth: { xs: "250px", sm: "300px" },
  maxWidth: { xs: "100vw", sm: "700px" },
  margin: "0 auto",
};

const StyledList = {
  backgroundColor: "#e2e8f0",
  borderRadius: 8,
  padding: 12,
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  maxHeight: "60vh",
  overflowY: "auto",
  boxShadow: "0 3px 6px rgba(150, 43, 43, 0.1)",
  border: "1px solid #e2e8f0",
};

const StyledItem = {
  backgroundColor: "white",
  padding: "16px",
  margin: "8px 0",
  borderRadius: 6,
  border: "1px solid #e2e8f0",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 12px rgba(0,0,0,0.12)",
  },
};

const ChipStyle = {
  fontWeight: 200,
  fontSize: "1rem",
  padding: "5px 5px",
  minWidth: "20px",
  height: "40px",
  borderRadius: "50px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const Column = ({ col: { list, id } }) => {
  const getUniqueThreatsAndVulns = (instancias) => {
    const threats = new Set(
      instancias
        .map((item) => item.ame_nombre || "Sin amenaza definida")
        .filter(Boolean)
    );
    const vulnerabilities = new Set(
      instancias
        .map((item) => item.vul_nombre || "Sin vulnerabilidad definida")
        .filter(Boolean)
    );
    return {
      threats: Array.from(threats),
      vulnerabilities: Array.from(vulnerabilities),
    };
  };

  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <Box sx={StyledColumn}>
          <Typography
            variant="h6"
            color="primary"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {id}
          </Typography>
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={StyledList}
          >
            {list.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 2 }}
              >
                {id === "Activos"
                  ? "No hay activos disponibles"
                  : "No hay activos seleccionados"}
              </Typography>
            )}
            {list.map((item, index) => {
              const { threats, vulnerabilities } = getUniqueThreatsAndVulns(
                item.instancias
              );
              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            Activo: {item.nombre}
                          </Typography>
                          {threats.length > 0 && (
                            <>
                              <Typography variant="caption" color="#aecbfa">
                                Amenazas ({threats.length}):
                              </Typography>
                              <ul style={{ margin: 0, paddingLeft: "16px" }}>
                                {threats.map((threat, i) => (
                                  <li key={i}>
                                    <Typography variant="caption">
                                      {threat}
                                    </Typography>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                          {vulnerabilities.length > 0 && (
                            <>
                              <Typography
                                variant="caption"
                                color="#f8b4b4
"
                              >
                                Vulnerabilidades ({vulnerabilities.length}):
                              </Typography>
                              <ul style={{ margin: 0, paddingLeft: "16px" }}>
                                {vulnerabilities.map((vuln, i) => (
                                  <li key={i}>
                                    <Typography variant="caption">
                                      {vuln}
                                    </Typography>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </Box>
                      }
                      placement="top"
                    >
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          ...StyledItem,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            gap: 2,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, flex: 1 }}
                          >
                            {item.nombre}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Chip
                              label={threats.length}
                              sx={{
                                ...ChipStyle,
                                backgroundColor: "#dbeafe",
                                color: "#1e40af",
                              }}
                              aria-label={`Número de amenazas: ${threats.length}`}
                            />
                            <Chip
                              label={vulnerabilities.length}
                              sx={{
                                ...ChipStyle,
                                backgroundColor: "#fce7f3",
                                color: "#be185d",
                              }}
                              aria-label={`Número de vulnerabilidades: ${vulnerabilities.length}`}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Tooltip>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Box>
        </Box>
      )}
    </Droppable>
  );
};

export default Column;
