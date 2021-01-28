import React from 'react';

import { Grid, Widget } from './GridPlaceholder.styles';

const GridPlaceholder = () => (
  <Grid data-testid="grid-placeholder">
    <Widget gridRow="1 / 3 " gridColumn="1 / 4" />
    <Widget gridRow="3 / 6 " gridColumn="1 / 4" />
    <Widget gridRow="1 / 2 " gridColumn="4 / 6" />
    <Widget gridRow="2 / 4 " gridColumn="4 / 6" />
    <Widget gridRow="4 / 6 " gridColumn="4 / 6" />
  </Grid>
);

export default GridPlaceholder;
