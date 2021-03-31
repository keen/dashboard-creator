import React from 'react';
import {
  render as rtlRender,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { AppContext } from '../../contexts';

import DatePickerWidget from './DatePickerWidget';

const render = (
  storeState: any = {},
  overProps: any = {},
  contextValues = {}
) => {
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

  const contextValue = {
    ...contextValues,
    modalContainer: '#modal-root',
  } as any;

  const wrapper = rtlRender(
    <Provider store={store}>
      <AppContext.Provider value={contextValue}>
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

  expect(getByText('relative_time_label.label 14 days')).toBeInTheDocument();
  expect(getByText('relative_time_label.today_includes')).toBeInTheDocument();
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

test('should not render tooltip on timezone section hover when timezone selection is enabled', async () => {
  const {
    wrapper: { getByTestId, queryByText },
  } = render(
    {},
    {},
    {
      widgetsConfiguration: {
        datePicker: {
          disableTimezoneSelection: false,
        },
      },
    }
  );

  const propertyContainer = getByTestId('dropable-container');
  fireEvent.click(propertyContainer);

  const timezoneContainer = getByTestId('timezone-container');
  fireEvent.mouseOver(timezoneContainer);

  const testId = await queryByText(
    'date_picker_widget.selection_disabled_description'
  );
  expect(testId).not.toBeInTheDocument();
});

test('should render tooltip on timezone section hover when timezone selection is disabled', async () => {
  const {
    wrapper: { getByTestId, queryByText },
  } = render(
    {},
    {},
    {
      widgetsConfiguration: {
        datePicker: {
          disableTimezoneSelection: true,
        },
      },
    }
  );

  const propertyContainer = getByTestId('dropable-container');
  fireEvent.click(propertyContainer);

  const timezoneContainer = getByTestId('timezone-container');
  fireEvent.mouseOver(timezoneContainer);

  const testId = await queryByText(
    'date_picker_widget.selection_disabled_description'
  );

  expect(testId).toBeInTheDocument();
});
