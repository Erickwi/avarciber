import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  padding: theme.spacing(2),
}));

const letraStyle = {
  fontFamily: 'var(--bs-font-sans-serif)',
  fontSize: '1.5rem',
  fontWeight: '400',
  lineHeight: '1.5',
  color: '#495057',
  backgroundColor: '#f8f9fa',
  webKitTextSizeAdjust: '100%',
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
};


export default function BasicGrid({children}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {/* Unir xs=4 y xs=8 en una sola fila */}
        <Grid item xs={12} md={12}>
          <Item style={letraStyle}>{children[0]}</Item>
        </Grid>
        {/* Unir xs=4 y xs=8 en una sola fila */}
        <Grid item xs={12} md={4}>
          <Item style={letraStyle}>{children[1]}</Item>
        </Grid>
        <Grid item xs={12} md={8}>
          <Item style={letraStyle}>{children[2]}</Item>
        </Grid>
      </Grid>
    </Box>
  );
}