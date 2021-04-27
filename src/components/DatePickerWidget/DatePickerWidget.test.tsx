import React from 'react';
import {
  render as rtlRender,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { AppContext } from '../../contexts';

import DatePickerWidget from './DatePickerWidget';
import { createBodyElementById } from '../../utils/test/createBodyElementById';
import { DROPDOWN_CONTAINER_ID } from '../../constants';

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
    timezone: {
      timezones: [
        {
          name: 'Europe/Warsaw',
          utcOffset: '+01:00',
          numberOfSecondsToOffsetTime: 3600,
        },
        {
          name: 'Africa/Nairobi',
          utcOffset: '+01:00',
          numberOfSecondsToOffsetTime: 3600,
        },
      ],
    },
    ...storeState,
  };

  const mockStore = configureStore([]);
  const store = mockStore({ ...state });

  const contextValue = {
    ...contextValues,
    widgetsConfiguration: {
      datePicker: {
        disableTimezoneSelection: true,
        defaultTimezone: 'Africa/Nairobi',
      },
    },
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
  createBodyElementById(DROPDOWN_CONTAINER_ID);
});

test('should render timeframe for active widget', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(getByText('relative_time_label.label 14 days')).toBeInTheDocument();
  expect(getByText('relative_time_label.today_includes')).toBeInTheDocument();
});

test('allows user to apply date picker modifiers', () => {
  const {
    store,
    wrapper: { getByText, getByTestId },
  } = render();

  const element = getByTestId('dropable-container');
  fireEvent.click(element);

  store.clearActions();

  const button = getByText('date_picker_widget.apply');
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "timeframe": "this_14_days",
          "timezone": "UTC",
          "widgetId": "@widget/01",
        },
        "type": "@widgets/SET_DATE_PICKER_WIDGET_MODIFIERS",
      },
      Object {
        "payload": Object {
          "id": "@widget/01",
        },
        "type": "@widgets/APPLY_DATE_PICKER_MODIFIERS",
      },
    ]
  `);
});

test('allows user to clear date picker modifiers', () => {
  const {
    store,
    wrapper: { getByText, getByTestId },
  } = render();

  const element = getByTestId('dropable-container');
  fireEvent.click(element);

  store.clearActions();

  const clearButton = getByText('date_picker_widget.clear');
  fireEvent.click(clearButton);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "id": "@widget/01",
        },
        "type": "@widgets/CLEAR_DATE_PICKER_MODIFIERS",
      },
    ]
  `);
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

test('Should render default timezone if widget has no data', async () => {
  const {
    wrapper: { getByTestId, findByTestId },
  } = render({
    widgets: {
      items: {
        '@widget/01': {
          isActive: true,
          data: {},
        },
      },
    },
  });

  const dropdown = getByTestId('dropable-container');
  fireEvent.click(dropdown);
  const timezoneSelect = await findByTestId('timezone-select');
  expect(timezoneSelect).toHaveTextContent('Africa/Nairobi');
});
