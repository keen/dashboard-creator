import React from 'react';
import { Provider } from 'react-redux';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import FilterSettings from './FilterSettings';
import { initialState as filterInitialState } from '../../modules/filter';

const render = (storeState: any = {}, overProps: any = {}) => {
  const mockStore = configureStore([]);

  const state = {
    widgets: {
      items: {
        '@widget/01': {
          widget: { type: 'visualization' },
        },
        '@widget/02': {
          widget: { type: 'visualization' },
        },
      },
    },
    dashboards: {
      items: {
        '@dashboard/01': {
          settings: {
            widgets: ['@widget/01', '@widget/02'],
          },
        },
      },
    },
    filter: {
      ...filterInitialState,
      widgetConnections: [
        {
          widgetId: '@widget/01',
          isConnected: false,
          title: null,
          positionIndex: 0,
        },
      ],
      eventStreamsPool: ['logins', 'purchases'],
      eventStreamSchema: {
        schema: {
          id: 'string',
          'user.gender': 'string',
        },
        list: [
          { path: 'id', type: 'string' },
          { path: 'user.gender', type: 'string' },
        ],
        tree: {
          id: ['id', 'string'],
          user: {
            gender: ['user.gender', 'string'],
          },
        },
      },
    },
    app: {
      activeDashboardId: '@dashboard/01',
    },
    ...storeState,
  };

  const store = mockStore({ ...state });

  const props = {
    onCancel: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(
    <Provider store={store}>
      <FilterSettings {...props} />
    </Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

test('allows user to manage filter widget connections', () => {
  const {
    wrapper: { getByText },
    store,
  } = render();

  const connection = getByText('filter_settings.untitled_chart 0');
  fireEvent.click(connection);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "isConnected": true,
          "widgetId": "@widget/01",
        },
        "type": "filter/updateConnection",
      },
    ]
  `);
});

test('allows user to select target property', () => {
  const state = {
    filter: {
      ...filterInitialState,
      widgetConnections: [
        {
          widgetId: '@widget/01',
          isConnected: false,
          title: null,
          positionIndex: 0,
        },
      ],
      eventStream: 'logins',
      eventStreamsPool: ['logins', 'purchases'],
      eventStreamSchema: {
        schema: {
          id: 'string',
          'user.gender': 'string',
        },
        list: [
          { path: 'id', type: 'string' },
          { path: 'user.gender', type: 'string' },
        ],
        tree: {
          id: ['id', 'string'],
          user: {
            gender: ['user.gender', 'string'],
          },
        },
      },
    },
  };

  const {
    wrapper: { getByText },
    store,
  } = render(state);

  const placeholder = getByText('filter_settings.target_property_placeholder');
  fireEvent.click(placeholder);

  const property = getByText('id');
  fireEvent.click(property);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": "id",
        "type": "filter/setTargetProperty",
      },
    ]
  `);
});

test('renders message about empty connections pool for dashbord without widgets', () => {
  const state = {
    dashboards: {
      items: {
        '@dashboard/01': {
          settings: {
            widgets: [],
          },
        },
      },
    },
  };

  const {
    wrapper: { getByText },
  } = render(state);

  expect(getByText('filter_settings.empty_connections')).toBeInTheDocument();
});

test('allows user to cancel filter widget configuration', () => {
  const {
    props,
    wrapper: { getByText },
  } = render();

  const cancelButton = getByText('filter_settings.cancel_button');
  fireEvent.click(cancelButton);

  expect(props.onCancel).toHaveBeenCalled();
});

test('renders error about unfinished filter widget configuration', () => {
  const state = {
    filter: {
      ...filterInitialState,
      name: 'filterName',
    },
  };
  const {
    wrapper: { getByText },
  } = render(state);

  const button = getByText('filter_settings.create_button');
  fireEvent.click(button);

  expect(getByText('filter_settings.settings_error')).toBeInTheDocument();
});

test('renders detached connections list', () => {
  const state = {
    filter: {
      ...filterInitialState,
      eventStream: 'logins',
      targetProperty: 'user.gender',
      detachedWidgetConnections: [
        {
          widgetId: '@widget/01',
          isConnected: false,
          title: null,
          positionIndex: 0,
        },
      ],
      eventStreamsPool: ['logins', 'purchases'],
      eventStreamSchema: {
        schema: {},
        list: [],
        tree: {},
      },
    },
  };

  const {
    wrapper: { getByText },
  } = render(state);

  expect(
    getByText('filter_settings.detached_widgets_description')
  ).toBeInTheDocument();
  expect(getByText('filter_settings.untitled_chart 0')).toBeInTheDocument();
});

test('allows user to apply filter widget settings', () => {
  const state = {
    filter: {
      ...filterInitialState,
      name: 'filterName',
      eventStream: 'logins',
      targetProperty: 'user.gender',
      widgetConnections: [
        {
          widgetId: '@widget/01',
          isConnected: false,
          title: null,
          positionIndex: 0,
        },
      ],
      eventStreamsPool: ['logins', 'purchases'],
      eventStreamSchema: {
        schema: {},
        list: [],
        tree: {},
      },
    },
  };

  const {
    store,
    wrapper: { getByText },
  } = render(state);

  const button = getByText('filter_settings.edit_button');
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": "filterName",
        "type": "filter/setName",
      },
      Object {
        "payload": undefined,
        "type": "@filter/APPLY_SETTINGS",
      },
    ]
  `);
});

test('not allows user to apply filter widget settings when name is not provided', () => {
  const state = {
    filter: {
      ...filterInitialState,
      eventStream: 'logins',
      targetProperty: 'user.gender',
      widgetConnections: [
        {
          widgetId: '@widget/01',
          isConnected: false,
          title: null,
          positionIndex: 0,
        },
      ],
      eventStreamsPool: ['logins', 'purchases'],
      eventStreamSchema: {
        schema: {},
        list: [],
        tree: {},
      },
    },
  };

  const {
    store,
    wrapper: { getByText },
  } = render(state);

  const button = getByText('filter_settings.edit_button');
  fireEvent.click(button);

  expect(store.getActions()).toStrictEqual([]);
});

test('do not renders Select/Unselect All link for empty connections list', () => {
  const {
    wrapper: { queryByText },
  } = render({
    filter: {
      ...filterInitialState,
    },
  });

  expect(queryByText('filter_settings.unselect_all')).toBeNull();
  expect(queryByText('filter_settings.select_all')).toBeNull();
});

test('renders "Select All" link', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(getByText('filter_settings.select_all')).toBeInTheDocument();
});

test('allows user to unselect all connected widgets', () => {
  const {
    wrapper: { getByText },
    store,
  } = render({
    filter: {
      ...filterInitialState,
      widgetConnections: [
        {
          widgetId: '@widget/01',
          isConnected: true,
          title: null,
          positionIndex: 0,
        },
        {
          widgetId: '@widget/02',
          isConnected: true,
          title: null,
          positionIndex: 1,
        },
        {
          widgetId: '@widget/03',
          isConnected: true,
          title: null,
          positionIndex: 2,
        },
      ],
    },
  });

  const toggleAll = getByText('filter_settings.unselect_all');
  fireEvent.click(toggleAll);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "isConnected": false,
          "widgetId": "@widget/01",
        },
        "type": "filter/updateConnection",
      },
      Object {
        "payload": Object {
          "isConnected": false,
          "widgetId": "@widget/02",
        },
        "type": "filter/updateConnection",
      },
      Object {
        "payload": Object {
          "isConnected": false,
          "widgetId": "@widget/03",
        },
        "type": "filter/updateConnection",
      },
    ]
  `);
});

test('allows user to select all connected widgets', () => {
  const {
    wrapper: { getByText },
    store,
  } = render();

  const toggleAll = getByText('filter_settings.select_all');
  fireEvent.click(toggleAll);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "isConnected": true,
          "widgetId": "@widget/01",
        },
        "type": "filter/updateConnection",
      },
    ]
  `);
});
