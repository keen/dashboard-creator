import React from 'react';
import { fireEvent, render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ColorManager from './ColorManager';
import { COLOR_PALETTES } from '../../../../modules/theme';

const render = (overProps: any = {}, overStore: any = {}) => {
  const props = {
    colorPaletteName: COLOR_PALETTES[0].name,
    colors: [],
    defaultColors: [],
    onUpdateColors: jest.fn(),
    onSelectPalette: jest.fn(),
    ...overProps,
  };

  const mockStore = configureStore([]);
  const store = mockStore({
    theme: {
      currentEditTheme: {},
    },
    ...overStore,
  });

  const wrapper = rtlRender(
    <Provider store={store}>
      <ColorManager {...props} />
    </Provider>
  );

  return {
    props,
    wrapper,
  };
};

test('should render the name of palette in dropdown', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  expect(getByText(props.colorPaletteName)).toBeInTheDocument();
});

test('should call onSelectUpdate when user changes palette', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const element = getByText(props.colorPaletteName);
  fireEvent.click(element);

  const newPalette = getByText('solid');
  fireEvent.click(newPalette);

  expect(props.onSelectPalette).toHaveBeenCalled();
});
