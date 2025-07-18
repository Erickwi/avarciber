import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import fondo from '../images/fondoOndas.svg';


const General = () => {
  return (
    <Box
      id="home"
      minHeight="90vh"
      display="grid"
      gridTemplateColumns="1fr"
      gap="1rem"
      sx={{
        position: 'relative',
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover', // or 'cover'
        backgroundPosition: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      {/* Information */}
      <Grid item xs={12} md={5} display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding="2rem">
        <Box fontSize="3rem" fontWeight="bold" lineHeight="4rem" position="relative">
          ¡Detecta tus riesgos y amenazas! con{' '}
          <span
            style={{
              display: 'inline-block',
              position: 'relative',
              padding: '2px 6px',
              border: '8px solid #3182CE',
              color: '#005892',
            }}
          >
            AVARCIBER
            <RiCheckboxBlankCircleFill
              style={{
                position: 'absolute',
                width: '1.5rem',
                height: '1.5rem',
                color: 'white',
                backgroundColor: '#3182CE',
                borderRadius: '50%',
                padding: '0.25rem',
                left: '-1.5rem',
                top: '3.6rem',
              }}
            />
            <RiCheckboxBlankCircleFill
              style={{
                position: 'absolute',
                width: '1.5rem',
                height: '1.5rem',
                color: 'white',
                backgroundColor: '#3182CE',
                borderRadius: '50%',
                padding: '0.25rem',
                left: '-1.5rem',
                top: '-1.5rem',
              }}
            />
            <RiCheckboxBlankCircleFill
              style={{
                position: 'absolute',
                width: '1.5rem',
                height: '1.5rem',
                color: 'white',
                backgroundColor: '#3182CE',
                borderRadius: '50%',
                padding: '0.25rem',
                right: '-1.5rem',
                top: '-1.5rem',
              }}
            />
            <RiCheckboxBlankCircleFill
              style={{
                position: 'absolute',
                width: '1.5rem',
                height: '1.5rem',
                color: 'white',
                backgroundColor: '#3182CE',
                borderRadius: '50%',
                padding: '0.25rem',
                right: '-1.5rem',
                bottom: '-1.5rem',
              }}
            />
          </span>
        </Box>
        <p style={{ fontSize: '1.5rem', lineHeight: '2rem', color: '#718096', textAlign: 'center' }}>
        Ayudar a encontrar soluciones con intuición y de acuerdo con los objetivos comerciales del cliente. Brindamos servicios de alta calidad.
        </p>
        <Box display="flex" flexDirection="column" gap="1rem" alignItems="center">
          <Button
            variant="contained"
            sx={{ width: '100%', backgroundColor: '#3182CE', color: 'white', borderRadius: '0.5rem', fontSize: '1.5rem' }}
          >
            Tutorial
          </Button>
        </Box>
      </Grid>
    </Box>
  );
};

export default General;
