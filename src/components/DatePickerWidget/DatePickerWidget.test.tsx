import React from 'react';
import { render as rtlRender, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { AppContext } from '../../contexts';

import DatePickerWidget from './DatePickerWidget';

const render = (storeState: any = {}, overProps: any = {}) => {
  const widgetId = '@widget/01';
  const props = {
    id: widgetId,
    ...overProps,
  };

  const state = {
    widgets: {
      items: {
        [widgetId]: {
          isActive: true,
          data: {
            timezone: 'UTC',
            timeframe: 'this_14_days',
          },
        },
      },
    },
    ...storeState,
  };

  const mockStore = configureStore([]);
  const store = mockStore({ ...state });

  const wrapper = rtlRender(
    <Provider store={store}>
      <AppContext.Provider
        value={
          {
            modalContainer: '#modal-root',
          } as any
        }
      >
        <DatePickerWidget {...props} />
      </AppContext.Provider>
    </Provider>
  );

  return {
    props,
    store,
    wrapper,
  };
};

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  }
});

test('should render timeframe for active widget', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(
    getByText('query_creator_relative_time_label.label 14 days')
  ).toBeInTheDocument();
  expect(
    getByText('query_creator_relative_time_label.today_includes')
  ).toBeInTheDocument();
});

test('should render widget title for inactive widget', () => {
  const widgetId = '@widget/02';
  const state = {
    widgets: {
      items: {
        [widgetId]: {
          isActive: false,
          data: null,
        },
      },
    },
  };

  const {
    wrapper: { getByText },
  } = render({ ...state }, { id: widgetId });
  expect(getByText('date_picker_widget.name')).toBeInTheDocument();
});