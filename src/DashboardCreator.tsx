import React from 'react';
import ReactDOM from 'react-dom';

import { Options } from './types';

export class DashboardCreator {
  private container: string;

  constructor(config: Options) {
    const { container } = config;

    this.container = container;
  }

  render() {
    ReactDOM.render(
      <div>Dashboard Creator</div>,
      document.querySelector(this.container)
    );
  }
}

export default DashboardCreator;
