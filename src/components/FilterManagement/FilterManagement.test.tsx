/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Provider } from 'react-redux';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import FilterManagement from './FilterManagement';

import { DRAG_HANDLE_ELEMENT } from '../Widget';

const render = (overProps: any = {}) => {
  const mockStore = configureStore([]);
  const store = mockStore({});

  const props = {
    id: '@widget/01',
    isHoverActive: true,
    onRemoveWidget: jest.fn(),
    onEditWidget: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(
    <Provider store={store}>
      <FilterManagement {...props} />
    </Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

test('renders grid drag handle element', () => {
  const {
    wrapper: { container },
  } = render();

  const [element] = container.getElementsByClassName(DRAG_HANDLE_ELEMENT);

  expect(element).toBeInTheDocument();
});

test('allows user to edit filter widget', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const button = getByText('filter_management.edit_text');
  fireEvent.click(button);

  expect(props.onEditWidget).toHaveBeenCalled();
});

test('allows user to remove filter widget', async () => {
  const {
    props,
    wrapper: { container, getByText },
  } = render();

  const button = container.querySelector(
    '[data-testid="remove-filter-widget"] button'
  );
  fireEvent.click(button);

  const removeConfirmation = getByText('widget.remove_confirm_button');
  fireEvent.click(removeConfirmation);

  expect(props.onRemoveWidget).toHaveBeenCalled();
});
